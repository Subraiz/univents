import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
} from "react-native";
import MapView from "react-native-maps";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Map extends Component {
  state = {
    mapRegion: null,
    lastLat: null,
    lastLong: null,
  }

  onRegionChange(mapRegion, lastLat, lastLong) {
    this.setState({
      mapRegion,
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong,
    });
  }

  componentDidMount() {
    this.requestCameraPermission();
  }

  async requestCameraPermission() {
    try {
      const granted = Platform.OS === 'ios' ? true : await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Permission',
          'message': 'Univents needs access to your location.',
        }
      );
      if (granted) {
        this.watchId = navigator.geolocation.watchPosition((position) => {
          const { latitude, longitude } = position.coords;
          let region = {
            latitude,
            longitude,
            latitudeDelta: 0.00922*1.5,
            longitudeDelta: 0.00421*1.5,
          };
          this.onRegionChange(region, region.latitude, region.longitude);
        }, (err) => {
          console.log(err);
        });
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
          latitudeDelta: 0.00922*1.5,
          longitudeDelta: 0.00421*1.5,
        }}
      />
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
