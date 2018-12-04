import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  Button
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Event from "../classes/Event";
import CustomMarker from "./CustomMarker";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Map extends Component {
  constructor(props) {
    super(props);
    // make sure this method gets the right scope, no matter how it's called
    this.createMarkers = this.createMarkers.bind(this);
  }

  state = {
    mapRegion: {
      latitude: 42.3355488,
      longitude: -71.16849450000001,
      latitudeDelta: 0.00922 * 3,
      longitudeDelta: 0.00421 * 3
    },
    lastLat: null,
    lastLong: null,
    markerIndex: 1
  };

  onRegionChange(mapRegion, lastLat, lastLong) {
    this.setState({
      mapRegion,
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }

  componentDidMount() {
    this.requestCameraPermission();
  }

  async requestCameraPermission() {
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
              // latitude: 42.3355488,
              // longitude: -71.16849450000001
              latitudeDelta: 0.00922 * 1.4,
              longitudeDelta: 0.00421 * 1.4
            };
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

  hideMarkers() {
    this.props.events.map((event, i) => {
      this["marker" + i].hideMarker();
    });
  }

  createMarkers(event, i) {
    return (
      <CustomMarker
        ref={marker => {
          this["marker" + i] = marker;
        }}
        key={event.getEventID()}
        navigation={this.props.navigation}
        event={event}
        coordinate={event.getEventCoordinates()}
        title={event.getEventName()}
        description={event.getEventDescription()}
      />
    );
  }

  render() {
    return (
      <View
        onMoveShouldSetResponder={() => {
          this.hideMarkers();
          return true;
        }}
        onResponderRelease={this.onPanDragStop}
      >
        <MapView
          style={styles.mapStyle}
          region={this.state.mapRegion}
          // showsUserLocation={true}
          followUserLocation={true}
          onRegionChange={this.onRegionChange.bind(this)}
          onPress={this.hideMarkers.bind(this)}
          initialRegion={{
            latitude: 42.3355488,
            longitude: -71.16849450000001,
            latitudeDelta: 0.00922 * 1.4,
            longitudeDelta: 0.00421 * 1.4
          }}
        >
          {this.props.events.map(this.createMarkers)}
        </MapView>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "white",
    height: screenHeight * 0.45
  },
  mapStyle: {
    height: screenHeight * 0.45,
    width: "100%"
  }
};

export default Map;
