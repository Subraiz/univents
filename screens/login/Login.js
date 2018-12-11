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
          backgroundColor: props.color,
          alignItems: "center",
          marginTop: 10,
          borderRadius: 30
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
            autoplayTimeout={1.75}
          >
            <View style={styles.slide1}>
              <Image
                source={require("../../assets/images/loginBackgroundImage.png")}
                style={styles.imageStyle}
              />
            </View>
            <View style={styles.slide2}>
              <Text style={styles.text}>Beautiful</Text>
            </View>
            <View style={styles.slide3}>
              <Text style={styles.text}>And simple</Text>
            </View>
          </Swiper>
        </View>
        <View style={styles.headerLogoContainer}>
          <Text style={styles.headerStyle}>UNIVENTS</Text>
        </View>
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
              color={"rgba(224, 116, 116, .9)"}
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
    alignItems: "center",
    marginTop: screenHeight * 0.1
  },
  headerStyle: {
    fontSize: 62,
    color: "white",
    fontWeight: "500"
  },
  imageStyle: {
    width: "100%",
    height: screenHeight,
    position: "absolute",
    opacity: 0.9
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
  }
};

export default Login;
