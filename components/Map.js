import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Event from "../classes/Event";
import CustomMarker from "./CustomMarker";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let event = new Event(
  "Soul Night",
  "Some good music",
  { month: "11", day: "29", year: "2018" },
  "BSF",
  {
    latitude: 42.45455,
    longitude: -71.1634
  },
  {
    locationAddress: "Commontwealth Ave",
    locationName: "Vandy"
  },
  {
    startTime: "7:00PM",
    endTime: "9:00PM"
  },
  "School",
  {
    uri:
      "http://2.bp.blogspot.com/-_Pt34rSuAG4/UVTJVmFingI/AAAAAAAAADM/sfeHZt-8jtk/s1600/neo+soul.jpg"
  },
  1998
);

console.log(event.getEventCoordinates());

class Map extends Component {
  state = {
    mapRegion: null,
    lastLat: null,
    lastLong: null
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
              latitudeDelta: 0.00922 * 3,
              longitudeDelta: 0.00421 * 3
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

  render() {
    return (
      <MapView
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
        <Marker
          coordinate={{
            latitude: 42.33834229849836,
            longitude: -71.16716750431807
          }}
          title={event.getEventName()}
          description={event.getEventDescription()}
        >
          <CustomMarker />
        </Marker>
      </MapView>
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
