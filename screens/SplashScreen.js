import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  UIManager,
  LayoutAnimation,
  Dimensions,
  Animated
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SplashScreen extends Component {
  componentWillUnmount() {
    // UIManager.setLayoutAnimationEnabledExperimental &&
    //   UIManager.setLayoutAnimationEnabledExperimental(true);
    // LayoutAnimation.easeInEaseOut();

    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
  }

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();

    this.position = new Animated.ValueXY(0, 0);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={this.position.getLayout()}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/UniventsSplashLogo.png")}
              style={styles.imageStyle}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "",
    alignItems: "center",
    justifyContent: "center"
  },
  imageContainer: {
    width: 250,
    height: 500
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  }
};

export default SplashScreen;
