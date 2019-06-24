import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  UIManager,
  LayoutAnimation
} from "react-native";
import * as Animatable from "react-native-animatable";
import Swiper from "react-native-swiper";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Button = props => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
      <Animatable.View
        animation={props.animation}
        style={{
          width: screenWidth * 0.9,
          borderColor: props.color,
          alignItems: "center",
          marginTop: 10,
          borderRadius: 35,
          backgroundColor: "rgba(0,0,0,.0)",
          borderWidth: 2
        }}
      >
        <Text
          style={{
            color: "white",
            padding: 20,
            fontSize: 18,
            fontWeight: "700"
          }}
        >
          {props.name}
        </Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

class Login extends Component {
  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  static navigationOptions = {
    header: null
  };

  onButtonPress = login => {
    if (login) {
      this.props.navigation.navigate("LoginForm");
    } else {
      this.props.navigation.navigate("SignUpForm");
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ position: "absolute" }}>
          <Swiper
            autoplay={true}
            width={screenWidth}
            height={screenHeight}
            autoplayTimeout={2.25}
          >
            <View style={styles.slide1}>
              <Image
                source={require("../../assets/images/loginBackgroundImage3.jpg")}
                style={styles.imageStyle}
              />
            </View>
            <View style={styles.slide2}>
              <Image
                source={require("../../assets/images/loginBackgroundImage2.jpg")}
                style={styles.imageStyle}
              />
              <View
                style={{
                  position: "absolute",
                  top: 35,
                  width: screenWidth,
                  alignItems: "flex-start",
                  left: 10
                }}
              >
                <Text style={{ color: "white", fontSize: 10 }}>
                  Photo By: @Nikkita.Photo
                </Text>
              </View>
            </View>
            <View style={styles.slide3}>
              <Image
                source={require("../../assets/images/loginBackgroundImage.jpg")}
                style={styles.imageStyle}
              />
            </View>
          </Swiper>
        </View>

        <Animatable.View
          style={styles.headerLogoContainer}
          animation="zoomInUp"
        >
          <Image
            source={require("../../assets/images/splurgeText.png")}
            style={styles.splurgeTextStyle}
          />
        </Animatable.View>
        <View style={styles.buttonsViewContainer}>
          <View style={styles.buttonsContainer}>
            <Button
              name={"Sign Up"}
              color={"rgba(230, 59, 59, 1)"}
              onPress={this.onButtonPress.bind(this, false)}
              animation="fadeInDown"
            />
            <Button
              name={"Login"}
              color={"orange"}
              onPress={this.onButtonPress.bind(this, true)}
              animation="fadeInUp"
            />
          </View>
        </View>
        <View style={styles.overlay} />
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#fff",
    flex: 1,
    height: screenHeight,
    zIndex: -2
  },
  headerLogoContainer: {
    marginTop: screenHeight * 0.1,
    height: screenHeight * 0.2,
    width: "90%",
    alignSelf: "center"
  },
  headerStyle: {
    fontSize: 62,
    color: "white",
    fontWeight: "700"
  },
  imageStyle: {
    width: "100%",
    height: screenHeight,
    position: "absolute",
    opacity: 0.95
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  buttonsViewContainer: {
    position: "absolute",
    height: "100%",
    width: screenWidth,
    justifyContent: "flex-end"
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB"
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5"
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9"
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  },
  splurgeTextStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  }
};

export default Login;
