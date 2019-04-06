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
  ScrollView,
  Animated,
  Share,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { uploadUser } from "../redux/actions/LoginActions";
import {
  fetchUserEvents,
  storeLocalEvents
} from "../redux/actions/EventsActions";
import InterestContainer from "../components/InterestContainer";
import LottieView from "lottie-react-native";
import EditEventModal from "./EditEventScreens/EditEventModal";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let tempEvent = {
  eventName: "Event Name",
  eventHost: "Event Host",
  eventDate: { month: 1, day: 1, year: 2019 },
  eventLocation: { locationAddress: "Location, Address" },
  eventTime: { startTime: "Hour:Minute", endTime: "Hour:Minute" },
  eventCoordinates: { latitude: -42, longitude: 32 },
  eventID: "l02HUkN10fb8uYXx1HKojfQjRZg212345"
};
let event = {};
let navigatable = {};

class EventInformation extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("data").eventName,
      gesturesEnabled: true
    };
  };

  state = {
    favorite: false,
    progress: new Animated.Value(0),
    event: tempEvent,
    edit: false,
    report: false
  };

  async componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();

    const { navigation } = this.props;
    event = navigation.getParam("data", "NO-DATA");
    this.setState({ event: event });
    navigatable = navigation.getParam("navigation", "NO-NAVIGATION");
    this.props.user.events.favoritedEvents.some(e => {
      let refrenceArray = e.split("/");
      if (this.state.event.eventID === refrenceArray[3]) {
        this.setState({ progress: new Animated.Value(1) });
        this.setState({ favorite: true });
        return true;
      }
    });
  }

  onLikePress() {
    this.setState({ favorite: !this.state.favorite });
    let refrenceArray = `Location/MA/Events/${event.eventID}`;
    if (!this.state.favorite) {
      Animated.timing(this.state.progress, {
        toValue: 1, // <-- Animate to the beginning of animation
        duration: 600
      }).start();
      this.props.user.events.favoritedEvents.push(refrenceArray);
      this.props.localFavoritedEvents.unshift(event);
    } else {
      Animated.timing(this.state.progress, {
        toValue: 0, // <-- Animate to the beginning of animation
        duration: 600
      }).start();
      let index = this.props.user.events.favoritedEvents.indexOf(refrenceArray);
      let localIndex = this.props.localFavoritedEvents.indexOf(event);
      this.props.user.events.favoritedEvents.splice(index, 1);
      this.props.localFavoritedEvents.splice(localIndex, 1);
    }
  }

  onSharePress() {
    let eventID = this.state.event.eventID.substring(
      0,
      this.state.event.eventID.length - 5
    );

    let downloadUrl =
      Platform.OS === "ios"
        ? "https://itunes.apple.com/us/app/splurge-events/id1457509493?ls=1&mt=8"
        : "https://play.google.com/store/apps/details?id=com.SplurgeLLC";

    let title;
    if (this.props.uid === eventID) {
      title = `I'm hosting an event: ${event.eventName}!`;
    } else {
      title = `Join me at ${event.eventName}!`;
    }
    let message = `${title}\n\n${
      event.eventDescription
    }\n\nFor more details go to the Splurge Events app. Download it now: ${downloadUrl}`;

    Share.share({
      message
    });
  }

  componentWillUpdate() {
    this.props.uploadUser(this.props.user);
    this.props.storeLocalEvents(
      this.props.localFavoritedEvents,
      "favoritedEvents"
    );
  }

  async onReturn() {
    navigatable.pop();
  }

  onAdminToolsPressed() {
    navigatable.navigate("AdminTools", {
      data: event
    });
  }

  renderAdminTools() {
    let eventID = this.state.event.eventID.substring(
      0,
      this.state.event.eventID.length - 5
    );
    if (
      this.props.uid == eventID ||
      this.props.uid == "l02HUkN10fb8uYXx1HKojfQjRZg2"
    ) {
      return (
        <TouchableOpacity
          style={styles.adminToolsContainer}
          onPress={this.onAdminToolsPressed}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            <Text
              style={{
                padding: 4,
                fontWeight: "600",
                fontSize: 18
              }}
            >
              Admin Tools
            </Text>

            <Icon name="md-arrow-forward" style={{ fontSize: 32 }} />
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderEditButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ edit: !this.state.edit });
        }}
        style={styles.actionButtonStyle}
      >
        <Icon
          name="md-create"
          style={{
            fontSize: 20,
            color: "black"
          }}
        />
      </TouchableOpacity>
    );
  }

  renderReportButton() {}

  renderCornerButton() {
    let eventID = this.state.event.eventID.substring(
      0,
      this.state.event.eventID.length - 5
    );
    if (
      this.props.uid == eventID ||
      this.props.uid == "l02HUkN10fb8uYXx1HKojfQjRZg2"
    ) {
      return this.renderEditButton();
    }
  }

  render() {
    let locationAddress = this.state.event.eventLocation.locationAddress;
    locationAddress = locationAddress.split(",");

    let { month, day, year } = this.state.event.eventDate;
    let eventDate = `${month} ${day}, ${year}`;

    let { startTime, endTime } = this.state.event.eventTime;
    let startTimeArray = startTime.split(":");
    let endTimeArray = endTime.split(":");
    let startHour;
    let startMinute;
    let endHour;
    let endMinute;
    let startTimeOfDay = "AM";
    let endTimeOfDay = "AM";

    /* Start Hour */
    startHour = parseInt(startTimeArray[0]);
    if (startHour == 0) {
      startHour = 12;
      startTimeOfDay = "AM";
    } else if (startHour > 12) {
      startHour = startHour - 12;
      startTimeOfDay = "PM";
    }
    startTime = `${startHour}:${startTimeArray[1]} ${startTimeOfDay}`;

    // End hour
    endHour = parseInt(endTimeArray[0]);
    if (endHour > 12) {
      endHour = endHour - 12;
      endTimeOfDay = "PM";
    } else if (endHour == 0) {
      endHour = 12;
      timeOfDay = "AM";
    }
    endTime = `${endHour}:${endTimeArray[1]} ${endTimeOfDay}`;
    let eventTime = `${startTime} - ${endTime}`;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.firstSection}>
            <View style={styles.headerImageContainer}>
              <FastImage style={styles.headerImage} source={event.eventImage} />
            </View>
            <View style={styles.informationContainer}>
              {/* Like and share button */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "absolute",
                  right: 0,
                  top: -20,
                  postion: "absolute"
                }}
              >
                <TouchableOpacity
                  onPress={this.onLikePress.bind(this)}
                  style={[
                    styles.actionButtonStyle,
                    {
                      marginRight: 10,
                      borderWidth: 0.5,
                      borderColor: "orange"
                    }
                  ]}
                >
                  <LottieView
                    progress={this.state.progress}
                    style={{ width: 35, height: 35, marginBottom: 2 }}
                    source={require("../assets/animations/favorite.json")}
                    loop={false}
                    ref={animation => (this.animation = animation)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onSharePress.bind(this)}
                  style={[
                    styles.actionButtonStyle,
                    {
                      marginRight: 10,
                      borderWidth: 0.5,
                      borderColor: "teal"
                    }
                  ]}
                >
                  <Icon
                    name="md-share"
                    style={{
                      fontSize: 20,
                      color: "orange"
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingRight: 15
                }}
              >
                {/* First section Event Name*/}
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.eventNameStyle}>
                    {this.state.event.eventName}
                  </Text>
                  <Text style={styles.eventHostTextStyle}>
                    {this.state.event.eventType} • {this.state.event.eventHost}
                  </Text>
                </View>
              </View>

              {/* Second section for date*/}
              <View style={styles.dateStyle}>
                <View
                  style={{ width: 30, marginRight: 10, alignItems: "center" }}
                >
                  <Icon
                    name="ios-calendar"
                    style={{ fontSize: 30, color: "grey" }}
                  />
                </View>
                <View style={styles.dateInformation}>
                  <Text
                    style={{ fontSize: 19, color: "black", fontWeight: "600" }}
                  >
                    {eventDate}
                  </Text>
                  <Text style={{ color: "black", fontWeight: "300" }}>
                    {eventTime}
                  </Text>
                  <TouchableOpacity>
                    <Text style={{ color: "blue", fontWeight: "300" }}>
                      Add to Calendar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Third section Location*/}
              <View style={styles.locationStyle}>
                <View
                  style={{ width: 30, marginRight: 10, alignItems: "center" }}
                >
                  <Icon
                    name="ios-pin"
                    style={{ fontSize: 32, color: "grey" }}
                  />
                </View>
                <View style={styles.locationInformation}>
                  <Text
                    style={{ fontSize: 19, color: "black", fontWeight: "600" }}
                  >
                    {this.state.event.eventLocation.locationName.trim()}
                  </Text>
                  <Text style={{ color: "black", fontWeight: "300" }}>
                    {locationAddress[0]}
                  </Text>
                  <Text style={{ color: "black", fontWeight: "300" }}>
                    {locationAddress[1].trim()},{locationAddress[2]}
                  </Text>
                </View>
              </View>
            </View>
            {this.renderAdminTools()}

            {/* Details */}
            <View style={styles.section}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Details</Text>
              </View>
              <Text style={styles.detailsText}>
                {this.state.event.eventDescription}
              </Text>
            </View>
            <View style={styles.section}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Location</Text>
              </View>

              {/* Map View */}
              <View style={styles.mapContainerStyle}>
                <MapView
                  style={styles.mapStyle}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  initialRegion={{
                    latitude: this.state.event.eventCoordinates.latitude,
                    longitude: this.state.event.eventCoordinates.longitude,
                    latitudeDelta: 0.00922 * 0.9,
                    longitudeDelta: 0.00421 * 0.9
                  }}
                >
                  <Marker coordinate={event.eventCoordinates} />
                </MapView>
              </View>
            </View>
          </View>
        </ScrollView>
        <EditEventModal
          visible={this.state.edit}
          onClose={() => this.setState({ edit: false })}
        />
        <View style={styles.cornerButtonStyle}>
          {this.renderCornerButton()}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    uid: state.user.uid,
    user: state.user,
    localFavoritedEvents: state.localUserEvents.favoritedEvents,
    localAttendedEvents: state.localUserEvents.attendedEvents
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      uploadUser: uploadUser,
      fetchUserEvents: fetchUserEvents,
      storeLocalEvents: storeLocalEvents
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
    marginTop: 15,

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
    fontSize: 22,
    fontWeight: "700",
    width: screenWidth * 0.75
  },
  eventHostTextStyle: {
    color: "grey",
    fontWeight: "400",
    width: screenWidth * 0.75
  },
  dateStyle: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
    alignItems: "center"
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
    alignItems: "center",
    paddingBottom: 10
  },
  locationIcon: {
    marginRight: 6,
    justifyContent: "center"
  },
  headerTextContainer: {
    borderBottomWidth: 0.25,
    borderBottomColor: "red",
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 6
  },
  headerText: {
    fontWeight: "600",
    fontSize: 18
  },
  detailsText: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    color: "darkgrey",
    fontWeight: "300"
  },
  adminToolsContainer: {
    backgroundColor: "white",
    padding: 8,
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
  },
  cornerButtonStyle: {
    position: "absolute",
    right: 10,
    top: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  actionButtonStyle: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventInformation);
