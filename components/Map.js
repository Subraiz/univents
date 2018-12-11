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
import MapView, { Marker, Callout } from "react-native-maps";
import Event from "../classes/Event";
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

  onRegionChange(mapRegion, lastLat, lastLong) {
    this.setState({
      mapRegion,
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }

  componentDidMount() {
    this.requestLocationPermission();
  }

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
            let region = {
              latitude,
              longitude,
              latitudeDelta: 0.00922 * 3,
              longitudeDelta: 0.00421 * 3
            };
            this.currentUserLocation = { latitude, longitude };
            this.onRegionChange(region, region.latitude, region.longitude);
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
    navigator.geolocation.clearWatch(this.watchId);
  }

  createMarkers() {
    return this.props.events.map(event => {
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
              <Image
                source={require("../assets/images/bostonCollegePin.png")}
                style={{
                  width: null,
                  height: null,
                  flex: 1,
                  resizeMode: "contain"
                }}
              />
            </Animatable.View>
          </Marker>
        );
      }
    });
  }

  onMarkerPress(event) {
    this.setState({
      opacity: 1,
      animation: "slideInLeft"
    });
    this.setState({ selectedEvent: event });
    this.renderMoreInfo();
  }

  onEventPress() {
    if (this.state.selectedEvent != null) {
      let data = this.state.selectedEvent;
      this.setState({ animation: "slideOutLeft" });
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
      <View
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
      >
        <MapView
          style={styles.mapStyle}
          // region={this.state.mapRegion}
          // showsUserLocation={true}
          // followUserLocation={true}
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
        {this.renderMoreInfo()}
      </View>
    );
  }

  // Card to show more info on the map
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
      let { startTime, endTime } = event.eventTime;
      eventDate = `${month} ${day}, ${year}`;
      eventTime = `${startTime} - ${endTime}`;

      eventName = event.eventName;
      eventLocation = event.eventLocation.locationAddress;
      eventImage = event.eventImage;
    }
    return (
      <Animatable.View
        animation={this.state.animation}
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
