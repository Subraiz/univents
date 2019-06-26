import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Event from "../classes/Event";
import CacheImage from "./common/CacheImage";
import MapView, { Marker, Callout } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";

import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Map extends Component {
  constructor(props) {
    super(props);
    // make sure this method gets the right scope, no matter how it's called
    this.createMarkers = this.createMarkers.bind(this);
    this.currentUserLocation = {};
  }

  state = {
    mapRegion: null,
    lastLat: null,
    lastLong: null,
    opacity: 0,
    animation: "slideOutLeft",
    selectedEvent: null
  };

  // Update the maps view area whenever the user drags around the screen.
  onRegionChange(mapRegion, lastLat, lastLong) {
    this.setState({
      mapRegion: mapRegion,
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }

  // Animate the map to go return to the users location.
  onLocatePress() {
    this.map.animateToRegion(this.currentUserLocation, 1000);
  }

  componentWillMount() {
    this.requestLocationPermission();
  }

  // Get users current location and check if we have permission to.
  // Also set the coordinates of the map to match users current location.
  async requestLocationPermission() {
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
        this.watchId = navigator.geolocation.watchPosition(
          position => {
            const { latitude, longitude } = position.coords;
            // Set region to match user's region
            let region = {
              latitude,
              longitude,
              latitudeDelta: 0.00922 * 3,
              longitudeDelta: 0.00421 * 3
            };
            this.currentUserLocation = {
              latitude,
              longitude,
              latitudeDelta: 0.00922 * 3,
              longitudeDelta: 0.00421 * 3
            };
            this.onRegionChange(region, region.latitude, region.longitude);
            this.map.animateToRegion(this.currentUserLocation, 1000);
          },
          err => {
            console.log(err);
          }
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId); // Stop tracking users location
  }

  // Function to create the pin drops for all events occurring today
  createMarkers() {
    return this.props.events.map(event => {
      let eventPin = {};
      // Set the proper event pin (different schools have different pins)
      if (event.eventPin != undefined && event.eventPin != "") {
        if (event.eventType.trim().toLowerCase() == "special") {
          eventPin = {
            uri:
              "https://firebasestorage.googleapis.com/v0/b/univents-a5f76.appspot.com/o/Pins%2FsplurgePin.png?alt=media&token=4d159e75-129c-4df6-9363-fd778abfff84"
          };
        } else {
          eventPin = event.eventPin;
        }
      } else {
        eventPin = {
          uri:
            "https://firebasestorage.googleapis.com/v0/b/univents-a5f76.appspot.com/o/Pins%2FsplurgePin.png?alt=media&token=4d159e75-129c-4df6-9363-fd778abfff84"
        };
      }

      // Generate the marker for the event
      if (event.eventID != undefined) {
        return (
          <Marker
            key={event.eventID}
            coordinate={event.eventCoordinates}
            onPress={this.onMarkerPress.bind(this, event)}
          >
            <Animatable.View
              animation="fadeInDown"
              style={{ width: 35, height: 35 }}
            >
              <CacheImage
                uri={eventPin.uri}
                style={{
                  width: 25,
                  height: 30
                }}
              />
            </Animatable.View>
          </Marker>
        );
      }
    });
  }

  // Animate in the little square in bottom left screen for event preview
  onMarkerPress(event) {
    this.setState({
      opacity: 1,
      animation: "slideInLeft"
    });
    this.setState({ selectedEvent: event });
    this.renderMoreInfo();
  }

  // Direct user to the event information screen.
  onEventPress() {
    if (this.state.selectedEvent != null) {
      let data = this.state.selectedEvent;
      this.setState({ animation: "slideOutLeft" });
      // Pass in data of the event so the event infromation screen knows what to render.
      setTimeout(() => {
        this.props.navigation.navigate("EventInformation", {
          data: data,
          navigation: this.props.navigation
        });
      }, 100);
    }
  }

  render() {
    return (
      <View>
        <MapView
          /*This bit of code hides the event square preview if the user drags anywhere else on the map */
          onMoveShouldSetResponder={event => {
            if (
              event.nativeEvent.locationX < screenWidth * 0.5 &&
              event.nativeEvent.locationY > screenHeight * 0.25
            ) {
              return;
            } else {
              this.setState({ animation: "slideOutLeft" });
            }
            return true;
          }}
          onResponderRelease={this.onPanDragStop}
          ref={map => (this.map = map)}
          style={styles.mapStyle}
          region={this.state.mapRegion}
          showsUserLocation={true}
          followUserLocation={true}
          onRegionChange={this.onRegionChange.bind(this)}
          initialRegion={{
            latitude: 42.3355488,
            longitude: -71.16849450000001,
            latitudeDelta: 0.00922 * 3,
            longitudeDelta: 0.00421 * 3
          }}
        >
          {this.createMarkers()}
        </MapView>

        {/* Return to users original location view box */}
        <View
          style={{
            position: "absolute",
            width: screenWidth,
            display: "flex",
            alignItems: "flex-end",
            paddingTop: 10,
            paddingRight: 10
          }}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={this.onLocatePress.bind(this)}
            style={{
              shadowOffset: { width: 0.3, height: -0.3 },
              shadowColor: "black",
              shadowOpacity: 0.3,
              shadowRadius: 1,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2
            }}
          >
            <Icon
              size={26}
              name="md-locate"
              style={{
                paddingTop: 7,
                width: 40,
                height: 40,
                textAlign: "center",
                color: "#f4b042",
                borderRadius: 20,
                backgroundColor: "white",
                overflow: "hidden"
              }}
            />
          </TouchableOpacity>
        </View>
        {this.renderMoreInfo()}
      </View>
    );
  }

  // Card to show more info on the map - gets the current selected event and pops it up on the screen
  // Move this to it's own component for code clean up!
  renderMoreInfo() {
    let eventDate = "";
    let eventName = "";
    let eventImage = {
      uri:
        "http://aooevents.com/wp-content/themes/invictus_3.3/images/dummy-image.jpg"
    };
    let eventLocation = "";
    let eventTime = "";
    if (this.state.selectedEvent != null) {
      let event = this.state.selectedEvent;
      let { month, day, year } = event.eventDate;

      let startTimeArray = event.eventTime.startTime.split(":");
      let endTimeArray = event.eventTime.endTime.split(":");

      let startHour;
      let startMinute;
      let endHour;
      let endMinute;

      let startTimeOfDay = "AM";
      let endTimeOfDay = "AM";

      startHour = parseInt(startTimeArray[0]);
      if (startHour == 0) {
        startHour = 12;
        startTimeOfDay = "AM";
      } else if (startHour > 12) {
        startTimeOfDay = "PM";
        startHour = startHour - 12;
      }
      let startTime = `${startHour}:${startTimeArray[1]}`;

      endHour = parseInt(endTimeArray[0]);
      if (endHour > 12) {
        endHour = endHour - 12;
        endTimeOfDay = "PM";
      } else if (endHour == 0) {
        endHour = 12;
        timeOfDay = "AM";
      }
      let endTime = `${endHour}:${endTimeArray[1]}`;
      eventTime = `${startTime}${startTimeOfDay} - ${endTime}${endTimeOfDay}`;

      eventName = event.eventName;
      eventLocation = event.eventLocation.locationAddress;
      eventImage = event.eventImage;
      eventDate = `${month} ${day}, ${year}`;
    }
    return (
      <Animatable.View
        animation={this.state.animation}
        delay={this.state.opacity == 0 ? 500 : 0}
        style={{
          position: "absolute",
          width: screenWidth * 0.5,
          height: screenHeight * 0.2,
          backgroundColor: "white",
          borderRadius: 15,
          marginTop: screenHeight * 0.24,
          marginLeft: screenWidth * 0.02,
          opacity: this.state.opacity,
          overflow: "hidden"
        }}
      >
        <TouchableOpacity onPress={this.onEventPress.bind(this)}>
          <View
            style={{
              flexDirection: "column",
              height: "100%",
              width: "100%",
              justifyContent: "flex-end"
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "40%",
                opacity: 0.7
              }}
              source={eventImage}
            />
            <View
              style={{
                width: "100%",
                height: "60%",
                backgroundColor: "white",
                flexDirection: "column",
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 15,
                paddingLeft: 15,
                justifyContent: "space-between"
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", flexWrap: "wrap" }}
                >
                  {eventName}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 10, fontWeight: "300" }}>
                  {eventDate} • {eventTime}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    paddingTop: 4,
                    fontWeight: "300",
                    color: "grey"
                  }}
                >
                  {eventLocation}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    position: "absolute",
    height: screenHeight * 0.65,
    width: "100%"
  }
});

export default Map;
