import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
  Button,
  Platform,
  Alert
} from "react-native";
import { Marker, Callout } from "react-native-maps";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const entrance = "bounceIn";
const exit = "bounceOut";

const SquareMarker = props => {
  let eventDate = `${props.event.eventDate.month} ${
    props.event.eventDate.day
  }, ${props.event.eventDate.year}`;

  let locationName = `${props.event.eventLocation.locationName}`;
  let locationAddress = `${props.event.eventLocation.locationAddress}`;

  console.log(props.event.getEventImage());

  return (
    <Animatable.View
      style={{
        width: screenWidth * 0.5,
        height: screenHeight * 0.17,
        borderRadius: 20,
        backgroundColor: "black",
        justifyContent: "space-around"
      }}
    >
      <Image
        source={props.event.getEventImage()}
        style={styles.imageStyle}
        borderRadius={20}
      />
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "800",
            marginTop: 4,
            marginBottom: 4
          }}
        >
          {props.event.getEventName()}
        </Text>
        <Text
          style={{
            color: "lightgrey",
            fontSize: 16,
            marginBottom: 4,
            fontWeight: "600"
          }}
        >
          {eventDate}
        </Text>
        <Text
          style={{
            color: "lightgrey",
            fontSize: 16,
            marginBottom: 4,
            fontWeight: "600"
          }}
        >
          {locationName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          padding: 8,
          width: "90%",
          marginTop: 4,
          borderRadius: 10,
          backgroundColor: "white",
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <Text style={{ color: "blue" }}>View More Info</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default class CustomMarker extends Component {
  state = {
    hidden: true,
    image: require("../assets/images/bostonCollegePin.png")
  };

  onMoreInfoPress() {
    this.props.navigation.navigate("EventInformation", {
      data: this.props.event,
      navigation: this.props.navigation
    });
  }

  componentWillUpdate() {
    if (Platform.OS === "ios") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
      LayoutAnimation.easeInEaseOut();
    }
  }

  hideMarker() {
    if (!this.state.hidden) {
      this.setState({ hidden: true });
    }
  }

  switchMarker() {
    this.setState({ hidden: !this.state.hidden });
  }

  renderMarker() {
    if (this.state.hidden) {
      return (
        <Animatable.View
          style={{
            width: 40,
            height: 40
          }}
        >
          <Image source={this.state.image} style={styles.logoStyle} />
        </Animatable.View>
      );
    } else {
      return (
        <SquareMarker
          event={this.props.event}
          onPress={this.onMoreInfoPress.bind(this)}
        />
      );
    }
  }

  renderAndroidMarker() {
    if (this.state.hidden) {
      return (
        <Marker
          coordinate={this.props.coordinate}
          tooltip={false}
          onPress={this.onMoreInfoPress.bind(this)}
          image={this.state.image}
        />
      );
    }
  }

  renderPlatformMarker() {
    if (Platform.OS === "ios") {
      return (
        <Marker
          coordinate={this.props.coordinate}
          tooltip={false}
          onPress={this.switchMarker.bind(this)}
        >
          {this.renderMarker()}
        </Marker>
      );
    } else {
      return <View>{this.renderAndroidMarker()}</View>;
    }
  }

  render() {
    return <View>{this.renderPlatformMarker()}</View>;
  }
}

const styles = {
  container: {
    width: 50,
    height: 75,
    flexDirection: "column",
    alignItems: "center",
    shadowOffset: { width: -2, height: 0.5 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  circles: {
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  innerCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "white",
    padding: 2
  },
  outerCircle: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "orange"
  },
  triangleContainer: {
    alignItems: "center",
    marginTop: -4
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 26,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "orange",
    position: "absolute"
  },
  logoStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  },
  squareContainer: {
    width: 200,
    height: 150,
    backgroundColor: "white",
    borderRadius: 30,
    shadowOffset: { width: -2, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 3
  },
  imageStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.75
  },
  opacityContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 30,
    opacity: 0.25
  },
  contentContainer: {
    alignItems: "center"
  }
};
