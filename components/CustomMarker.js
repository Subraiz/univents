import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
  Button
} from "react-native";
import { Marker, Callout } from "react-native-maps";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const entrance = "bounceIn";
const exit = "bounceOut";

const CircleMarker = props => {
  return (
    <Animatable.View style={styles.container} animation="bounceIn">
      <View style={styles.outerCircle} />
      <View style={styles.circles}>
        <View style={styles.innerCircle}>
          <Image
            style={styles.logoStyle}
            source={require("../assets/images/bostonCollegeLogo.png")}
          />
        </View>
      </View>
      <View style={styles.triangleContainer}>
        <View style={styles.triangle} />
      </View>
    </Animatable.View>
  );
};

class SquareMarker extends Component {
  componentWillUnmount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <Animatable.View style={styles.squareContainer} animation="bounceIn">
        <Image
          source={this.props.event.getEventImage()}
          style={styles.imageStyle}
          borderRadius={30}
        />
        <View style={styles.opacityContainer} />
        <View style={styles.contentContainer}>
          <Text>{this.props.event.getEventName()}</Text>
          <Button title={"View More Info"} onPress={this.props.onPress} />
        </View>
      </Animatable.View>
    );
  }
}

export default class CustomMarker extends Component {
  state = {
    hidden: true
  };

  onMoreInfoPress() {
    this.props.navigation.navigate("EventInformation", {
      data: this.props.event,
      navigation: this.props.navigation
    });
  }

  renderMarker() {
    if (this.state.hidden) {
      return <CircleMarker />;
    } else {
      return (
        <SquareMarker
          onPress={this.onMoreInfoPress.bind(this)}
          event={this.props.event}
        />
      );
    }
  }

  changeMarker() {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    return (
      <Marker
        coordinate={this.props.coordinate}
        title={this.props.title}
        description={this.props.description}
        ref={marker => {
          this.marker = marker;
        }}
        onPress={this.changeMarker.bind(this)}
      >
        {this.renderMarker()}
        <Callout tooltip={true}>
          <View />
        </Callout>
      </Marker>
    );
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
    opacity: 0.6
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
  },
  eventTitleStyle: {}
};
