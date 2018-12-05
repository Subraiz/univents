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
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

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
        <Image
          style={styles.imageStyle}
          source={require("../../assets/images/loginBackgroundImage.png")}
        />
        <Animatable.View
          style={styles.headerLogoContainer}
          animation="slideInDown"
          duration={750}
        >
          <Text style={styles.headerStyle}>UNIVENTS</Text>
        </Animatable.View>
        <View style={styles.buttonsViewContainer}>
          <View style={styles.buttonsContainer}>
            <Button
              animation={"fadeInDown"}
              name={"Sign Up"}
              color={"rgba(230, 59, 59, 1)"}
              onPress={this.onButtonPress.bind(this, false)}
            />
            <Button
              animation={"fadeInUp"}
              name={"Login"}
              color={"rgba(224, 116, 116, .9)"}
              onPress={this.onButtonPress.bind(this, true)}
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
    fontWeight: "600"
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
  }
};

export default Login;
