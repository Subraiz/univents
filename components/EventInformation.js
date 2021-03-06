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
  Platform,
  Alert,
  Linking,
  WebView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import FastImage from "react-native-fast-image";
import { addUserAttended } from "../classes/EventFunctions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { uploadUser } from "../redux/actions/LoginActions";
import { updateEventData } from "../redux/actions/EventActions";
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
      gesturesEnabled: true,
      header: null
    };
  };

  state = {
    favorite: false,
    progress: new Animated.Value(0),
    edit: false,
    report: false,
    currentUserLocation: { longitude: 0, latitude: 0 }
  };

  async componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();

    this.getUserLocation();

    const { navigation } = this.props;
    event = navigation.getParam("data", "NO-DATA");
    navigatable = navigation.getParam("navigation", "NO-NAVIGATION");
    this.setState({ event });
    this.props.user.events.favoritedEvents.some(e => {
      let refrenceArray = e.split("/");
      if (event.eventID === refrenceArray[3]) {
        this.setState({ progress: new Animated.Value(1) });
        this.setState({ favorite: true });
        return true;
      }
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  componentWillUpdate() {
    this.props.uploadUser(this.props.user);
    this.props.storeLocalEvents(
      this.props.localFavoritedEvents,
      "favoritedEvents"
    );
  }

  /* ------------------------ Helper Functions --------------------*/

  async getUserLocation() {
    try {
      const granted =
        Platform.OS === "ios"
          ? true
          : await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: "Location Permission",
                message: "Univents needs access to your location."
              }
            );
      if (granted) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            let currentUserLocation = { latitude, longitude };

            this.setState({ currentUserLocation: currentUserLocation });
          },
          error => Alert.alert(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }

  checkIfUserInRange(userLocation, eventLocation) {
    let longitude,
      latitude = false;
    const delta = 0.0008;
    let userLong = userLocation.longitude;
    let userLat = userLocation.latitude;
    let eventLong = eventLocation.longitude;
    let eventLat = eventLocation.latitude;
    console.log(userLocation);

    let negativeLongThreshold = eventLong - delta;
    let positiveLongThreshold = eventLong + delta;
    if (
      negativeLongThreshold <= userLong &&
      userLong <= positiveLongThreshold
    ) {
      longitude = true;
    }
    let negativeLatThreshold = eventLat - delta;
    let positiveLatThreshold = eventLat + delta;
    if (negativeLatThreshold <= userLat && userLat <= positiveLatThreshold) {
      latitude = true;
    }
    console.log(negativeLatThreshold);
    if (longitude && longitude) {
      return true;
    } else {
      return false;
    }
  }

  checkIfAttending(event, uid) {
    for (let i = 0; i < event.eventData.usersAttended.length; i++) {
      if (event.eventData.usersAttended[i].uid === uid) {
        return true;
      }
    }
    return false;
  }

  /* ------------------------ Action Responsive Functions --------------------*/

  onCheckInEvent() {
    let userInRange = this.checkIfUserInRange(
      this.state.currentUserLocation,
      event.eventCoordinates
    );
    if (userInRange) {
      let userAttending = this.checkIfAttending(event, this.props.uid);
      if (!userAttending) {
        addUserAttended(event, this.props.user);
        this.props.updateEventData(event, "MA");
        Alert.alert(
          "Success",
          "You Have Checked In 👍",
          [
            {
              text: "Got It",
              onPress: () => {},
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Already Attending",
          "You Are Already Marked As Attending This Event",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        "Not In Range",
        "It seems that you are not close enough to the event to check in.",
        [
          {
            text: "OK",
            onPress: () => {},
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    }
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
    let eventID = event.eventID.substring(0, event.eventID.length - 5);

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

  onAdminToolsPressed() {
    navigatable.navigate("AdminTools", {
      data: event
    });
  }

  /* ---------------- Rendering Elements ------------------------*/

  renderAdminTools() {
    let eventID = event.eventID.substring(0, event.eventID.length - 5);
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Icon
                name="ios-build"
                style={{ fontSize: 22, paddingRight: 10, color: "#c7c7c7" }}
              />
              <Text
                style={{
                  padding: 4,
                  fontFamily: "PublicSans-Regular",
                  fontSize: 18
                }}
              >
                Admin Tools
              </Text>
            </View>
            <Icon name="ios-arrow-forward" style={{ fontSize: 24 }} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.onCheckInEvent()}
          style={[
            {
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#92C83D",
              alignItems: "center",
              marginLeft: 25,
              marginRight: 25,
              marginTop: 25,
              marginBottom: 10,
              borderRadius: 25,
              paddingVertical: 15,
              shadowOffset: { width: 1, height: 2.5 },
              shadowColor: "black",
              shadowOpacity: 0.08,
              shadowRadius: 6
            }
          ]}
        >
          <Text
            style={{
              fontFamily: "PublicSans-Bold",
              color: "white",
              fontSize: 15
            }}
          >
            Check Into Event
          </Text>
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

  renderCornerButton() {
    let eventID = event.eventID.substring(0, event.eventID.length - 5);
    if (
      this.props.uid == eventID ||
      this.props.uid == "l02HUkN10fb8uYXx1HKojfQjRZg2"
    ) {
      return this.renderEditButton();
    }
  }

  returnEditedEvent(editedEvent) {
    event = editedEvent;
    this.setState({ event: editedEvent });
  }

  /* Handling event links */

  // Render any links associated w/ the event
  renderEventLinks() {
    return event.eventLinks.map((link, i) => {
      return (
        <TouchableOpacity
          title="click"
          onPress={() => Linking.openURL(link)}
          key={i}
        >
          <Text style={styles.linkStyle}>{link.toLowerCase()}</Text>
        </TouchableOpacity>
      );
    });
  }

  renderLinksContainer() {
    if (event.eventLinks != undefined && event.eventLinks.length != 0) {
      return (
        <View style={styles.section}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Event Links</Text>
          </View>
          <View style={{ marginLeft: screenWidth * 0.025, marginTop: 5 }}>
            {this.renderEventLinks()}
          </View>
        </View>
      );
    }
  }

  render() {
    let locationAddress = event.eventLocation.locationAddress;
    locationAddress = locationAddress.split(",");

    let { month, day, year } = event.eventDate;
    let eventDate = `${month} ${day}, ${year}`;

    let { startTime, endTime } = event.eventTime;
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
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.firstSection}>
            <View style={styles.headerImageContainer}>
              <FastImage style={styles.headerImage} source={event.eventImage} />
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.pop();
                }}
                style={{
                  position: "absolute",
                  top: 40,
                  left: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  shadowOffset: { width: 1, height: 1 },
                  shadowColor: "black",
                  shadowOpacity: 0.3,
                  shadowRadius: 2
                }}
              >
                <Icon
                  name="ios-arrow-back"
                  style={{ fontSize: 18, paddingTop: 1, paddingRight: 1 }}
                />
              </TouchableOpacity>
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
                  activeOpacity={0.75}
                  onPress={this.onLikePress.bind(this)}
                  style={[
                    styles.actionButtonStyle,
                    {
                      marginRight: 10,
                      shadowColor: "black",
                      shadowOffset: { x: 0, y: 2 },
                      shadowRadius: 6,
                      shadowOpacity: 0.1
                    }
                  ]}
                >
                  <Icon
                    name="ios-bookmark"
                    style={{
                      fontSize: 20,
                      color: this.state.favorite ? "#92C83D" : "black",
                      paddingLeft: 1,
                      paddingBottom: 1
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={this.onSharePress.bind(this)}
                  style={[
                    styles.actionButtonStyle,
                    {
                      marginRight: 10,
                      shadowColor: "black",
                      shadowOffset: { x: 0, y: 2 },
                      shadowRadius: 6,
                      shadowOpacity: 0.1
                    }
                  ]}
                >
                  <Icon
                    name="ios-share"
                    style={{
                      fontSize: 20,
                      color: "black",
                      paddingLeft: 1,
                      paddingBottom: 1
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
                  <Text style={styles.eventNameStyle}>{event.eventName}</Text>
                  <Text style={styles.eventHostTextStyle}>
                    {event.eventType} • Host: {event.eventHost}
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
                    style={{
                      fontSize: 19,
                      color: "black",
                      fontFamily: "PublicSans-SemiBold"
                    }}
                  >
                    {eventDate}
                  </Text>
                  <Text
                    style={{ color: "black", fontFamily: "PublicSans-Light" }}
                  >
                    {eventTime}
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{
                        color: "#00AEEF",
                        fontFamily: "PublicSans-Light"
                      }}
                    >
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
                    style={{
                      fontSize: 19,
                      color: "black",
                      fontFamily: "PublicSans-SemiBold",
                      width: screenWidth * 0.9
                    }}
                  >
                    {event.eventLocation.locationName.trim()}
                  </Text>
                  <Text
                    style={{ color: "black", fontFamily: "PublicSans-Light" }}
                  >
                    {locationAddress[0]}
                  </Text>
                  <Text
                    style={{ color: "black", fontFamily: "PublicSans-Light" }}
                  >
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
              <Text style={styles.detailsText}>{event.eventDescription}</Text>
            </View>
            {/* Event Links*/}
            {this.renderLinksContainer()}
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
                    latitude: event.eventCoordinates.latitude,
                    longitude: event.eventCoordinates.longitude,
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
          returnEditedEvent={this.returnEditedEvent.bind(this)}
          event={event}
          visible={this.state.edit}
          onClose={() => this.setState({ edit: false })}
        />

        <View style={styles.cornerButtonStyle}>
          {this.renderCornerButton()}
        </View>
      </View>
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
      storeLocalEvents: storeLocalEvents,
      updateEventData: updateEventData
    },
    dispatch
  );
};

const styles = {
  container: {
    backgroundColor: "#F7F7F7",
    flex: 1
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
    fontFamily: "PublicSans-Bold",
    width: screenWidth * 0.7
  },
  eventHostTextStyle: {
    color: "grey",
    fontFamily: "PublicSans-Regular",
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
    borderBottomWidth: 1,
    borderBottomColor: "#92C83D",
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 6
  },
  headerText: {
    fontFamily: "PublicSans-SemiBold",
    fontSize: 18
  },
  detailsText: {
    paddingLeft: 15,
    paddingTop: 10,
    paddingRight: 10,
    color: "darkgrey",
    fontFamily: "PublicSans-Light"
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
    top: 40,
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
  },
  linkStyle: { marginBottom: 3, color: "#147efb" }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventInformation);
