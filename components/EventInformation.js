import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  UIManager,
  LayoutAnimation,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signOutUser } from "../redux/actions/SettingsActions";
import { Icon } from "react-native-elements";
import InterestContainer from "../components/InterestContainer";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let event = {};
let navigatable = {};

class EventInformation extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();

    const { navigation } = this.props;
    event = navigation.getParam("data", "NO-DATA");
    navigatable = navigation.getParam("navigation", "NO-NAVIGATION");
  }

  onReturn() {
    navigatable.pop();
  }

  onAdminToolsPressed() {
    navigatable.navigate("AdminTools");
  }

  renderAdminTools() {
    let eventID = event.eventID.substring(0, event.eventID.length - 5);
    if (this.props.uid == eventID) {
      return (
        <TouchableOpacity
          style={styles.adminToolsContainer}
          onPress={this.onAdminToolsPressed}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ padding: 10, color: "grey" }}>Admin Tools</Text>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "center"
              }}
            >
              <Icon name="settings" />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    let locationAddress = event.getEventLocation().locationAddress;
    locationAddress = locationAddress.split(",");

    let { month, day, year } = event.getEventDate();
    let eventDate = `${month} ${day}, ${year}`;

    let { startTime, endTime } = event.getEventTime();
    let eventTime = `${startTime} - ${endTime}`;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.firstSection}>
            <View style={styles.headerImageContainer}>
              <Image
                style={styles.headerImage}
                source={event.getEventImage()}
              />
              <TouchableOpacity
                onPress={this.onReturn}
                style={{ position: "absolute", paddingTop: 5, paddingLeft: 5 }}
              >
                <View style={styles.iconContainerStyle}>
                  <Image
                    style={styles.iconStyle}
                    source={require("../assets/images/returnIcon.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.informationContainer}>
              <Text style={styles.eventNameStyle}>{event.getEventName()}</Text>
              <Text style={styles.eventHostTextStyle}>
                {event.getEventType()} • {event.getEventHost()}
              </Text>
              <View style={styles.dateStyle}>
                <View style={styles.dateIcon}>
                  <View style={[styles.iconContainerStyle]}>
                    <Image
                      style={[styles.iconStyle]}
                      source={require("../assets/images/calendarIcon.png")}
                    />
                  </View>
                </View>
                <View style={styles.dateInformation}>
                  <Text style={{ fontSize: 19, color: "black" }}>
                    {eventDate}
                  </Text>
                  <Text style={{ color: "black" }}>{eventTime}</Text>
                  <TouchableOpacity>
                    <Text style={{ color: "blue" }}>Add to Calendar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.locationStyle}>
                <View style={styles.locationIcon}>
                  <View
                    style={[
                      styles.iconContainerStyle,
                      {
                        width: screenWidth * 0.06,
                        height: screenWidth * 0.06
                      }
                    ]}
                  >
                    <Image
                      style={styles.iconStyle}
                      source={require("../assets/images/locationIcon.png")}
                    />
                  </View>
                </View>
                <View style={styles.locationInformation}>
                  <Text style={{ fontSize: 19, color: "black" }}>
                    {event.getEventLocation().locationName}
                  </Text>
                  <Text>{locationAddress[0]}</Text>
                  <Text>
                    {locationAddress[1].trim()}, {locationAddress[2]}
                  </Text>
                  <Text />
                </View>
              </View>
            </View>

            {this.renderAdminTools()}

            <View style={styles.section}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Details</Text>
              </View>
              <Text style={styles.detailsText}>
                {event.getEventDescription()}
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Location</Text>
              </View>
              <View style={styles.mapContainerStyle}>
                <MapView
                  style={styles.mapStyle}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  initialRegion={{
                    latitude: 42.3355488,
                    longitude: -71.16849450000001,
                    latitudeDelta: 0.00922 * 1.5,
                    longitudeDelta: 0.00421 * 1.5
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: 42.3355488,
                      longitude: -71.16849450000001
                    }}
                  />
                </MapView>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    uid: state.user.uid
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signOutUser: signOutUser
    },
    dispatch
  );
};

const styles = {
  container: {
    backgroundColor: "#F7F7F7"
  },
  firstSection: {
    marginBottom: 15
  },
  section: {
    marginBottom: 10,
    paddingBottom: 10,
    backgroundColor: "white"
  },
  headerImageContainer: {
    width: screenWidth,
    height: screenHeight * 0.2
  },
  headerImage: {
    flex: 1,
    width: null,
    height: null
  },
  informationContainer: {
    marginTop: 5,
    backgroundColor: "white",
    paddingLeft: 10
  },
  eventNameStyle: {
    fontSize: 20,
    fontWeight: "700"
  },
  eventHostTextStyle: {
    color: "grey",
    fontWeight: "500"
  },
  dateStyle: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10
  },
  dateIcon: {
    marginRight: 6,
    justifyContent: "center"
  },
  dateInformation: {},
  locationStyle: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5
  },
  locationIcon: {
    marginRight: 6,
    justifyContent: "center"
  },
  headerTextContainer: {
    borderBottomWidth: 0.25,
    borderBottomColor: "red",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 6
  },
  headerText: {
    color: "grey",
    fontWeight: "500",
    fontSize: 17
  },
  detailsText: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    color: "grey",
    fontWeight: "300"
  },
  adminToolsContainer: {
    backgroundColor: "white",
    marginBottom: 15,
    padding: 10,
    marginTop: 10
  },
  mapStyle: {
    width: screenWidth * 0.96,
    height: screenHeight * 0.25
  },
  mapContainerStyle: {
    alignItems: "center",
    marginTop: 10,
    shadowOffset: { width: -1, height: 1 },
    shadowColor: "black",
    shadowRadius: 2,
    shadowOpacity: 0.3
  },
  iconContainerStyle: {
    width: screenWidth * 0.07,
    height: screenWidth * 0.07
  },
  iconStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain",
    marginRight: 5
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventInformation);
