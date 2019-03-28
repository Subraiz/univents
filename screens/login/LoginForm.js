import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Animated,
  Easing
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextField } from "react-native-material-textfield";
import Ripple from "./Helpers/ripple";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { Button } from "../../components/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateLoginInfo, loginUser } from "../../redux/actions/LoginActions";
import {
  fetchEvents,
  fetchUserEvents
} from "../../redux/actions/EventsActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EXPANDED_BUTTON_WIDTH = screenWidth - 100;
const COLLAPSED_BUTTON_WIDTH = 40;

const AnimatedRipple = Animated.createAnimatedComponent(Ripple);

class LoginForm extends Component {
  state = {
    visible: false,
    buttonWidth: new Animated.Value(EXPANDED_BUTTON_WIDTH),
    opacity: new Animated.Value(1),
    loaderOpacity: new Animated.Value(0),
    buttonOpacity: new Animated.Value(1),
    rotation: new Animated.Value(0),
    circlePosition: { x: 0, y: 0 },
    scale: new Animated.Value(0),
    circleOpacity: new Animated.Value(0),
    inputAnimation: new Animated.Value(1)
  };

  componentDidMount() {
    StatusBar.setBarStyle("light-content", true);

    this.state.buttonWidth.addListener(({ value }) => {
      if (value === COLLAPSED_BUTTON_WIDTH) {
        Animated.parallel([
          Animated.timing(this.state.buttonOpacity, {
            toValue: 0,
            duration: 150
          }),
          Animated.timing(this.state.loaderOpacity, {
            toValue: 1,
            duration: 250
          }),
          Animated.loop(
            Animated.timing(this.state.rotation, {
              toValue: 1,
              duration: 300,
              easing: Easing.linear
            })
          )
        ]).start();

        //Animate white circle
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(this.state.circleOpacity, {
              toValue: 1,
              duration: 200
            }),
            Animated.timing(this.state.scale, {
              toValue: 1,
              duration: 1100,
              easing: Easing.linear
            })
          ]).start();
        }, 500);
      }
    });
  }

  static navigationOptions = {
    header: null
  };

  renderErrorMessage() {
    if (this.props.error != "") {
      return (
        <FormValidationMessage labelStyle={{ color: "white", marginTop: 5 }}>
          Incorrect Email or Password
        </FormValidationMessage>
      );
    }
  }

  async onPress() {
    if (this.props.email && this.props.password) {
      await this.props.loginUser(this.props.email, this.props.password);
      await this.props.fetchEvents("MA", this.props.user);
      await this.props.fetchUserEvents(this.props.user);
      if (this.props.authorized) {
        Animated.parallel([
          Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 150
          }),
          Animated.timing(this.state.buttonWidth, {
            toValue: COLLAPSED_BUTTON_WIDTH,
            duration: 300
          }),
          Animated.timing(this.state.inputAnimation, {
            toValue: 0,
            duration: 300,
            delay: 100
          })
        ]).start();
        setTimeout(() => {
          this.props.navigation.navigate("AppNavigator");
        }, 1000);
      }
    }
  }

  onForgotPasswordPress() {
    this.setState({ visible: true });
  }

  renderButton() {
    if (this.props.loading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return <Button onPress={this.onPress.bind(this)} title="Login" />;
  }

  render() {
    const inputProps = {
      textColor: "white",
      baseColor: "rgba(255,255,255,0.8)",
      tintColor: "rgba(255,255,255,0.8)"
    };

    const spin = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    const borderColor = this.state.buttonOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(0,0,0,0)", "white"]
    });

    const scale = this.state.scale.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100]
    });

    const translateY = this.state.inputAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 60]
    });

    return (
      <View style={styles.container}>
        <Image
          style={styles.background}
          source={require("../../assets/images/loginBackgroundImage2.jpg")}
        />
        <View style={styles.backgroundOverlay} />
        <View style={styles.headerLogoContainer}>
          <Image
            source={require("../../assets/images/UniventsLogo.png")}
            style={styles.splurgeTextStyle}
          />
        </View>
        <KeyboardAwareScrollView>
          <View style={styles.inputContainer}>
            <Animated.View
              style={{
                opacity: this.state.inputAnimation,
                transform: [{ translateY }]
              }}
            >
              <TextField
                {...inputProps}
                label="Email"
                style={styles.inputStyle}
                onChangeText={text =>
                  this.props.updateLoginInfo({ prop: "email", value: text })
                }
              />
              <TextField
                {...inputProps}
                label="Password"
                secureTextEntry={true}
                style={styles.inputStyle}
                onChangeText={text =>
                  this.props.updateLoginInfo({ prop: "password", value: text })
                }
                value={this.props.password}
              />
            </Animated.View>
            <AnimatedRipple
              onLayout={({ nativeEvent }) => {
                //get button coords for the circle
                const { x, y } = nativeEvent.layout;
                if (this.state.circlePosition.x === 0)
                  this.setState({ circlePosition: { x, y } });
              }}
              rippleContainerBorderRadius={20}
              rippleOpacity={0.5}
              onPress={this.onPress.bind(this)}
              rippleColor={"white"}
              style={{
                marginTop: 80,
                alignSelf: "center",
                width: this.state.buttonWidth
              }}
            >
              <Animated.View
                style={[styles.loginButtonStyle, { borderColor: borderColor }]}
              >
                <Animated.Text
                  style={[
                    styles.loginTextStyle,
                    { opacity: this.state.opacity }
                  ]}
                >
                  LOG IN
                </Animated.Text>
                {this.renderErrorMessage()}
                <Animated.Image
                  style={[
                    styles.loaderStyle,
                    {
                      opacity: this.state.loaderOpacity,
                      transform: [{ rotate: spin }]
                    }
                  ]}
                  source={require("../../assets/images/spinner.png")}
                />
              </Animated.View>
            </AnimatedRipple>
            <TouchableOpacity onPress={this.onForgotPasswordPress.bind(this)}>
              <Text style={styles.bottomTextStyle}>
                Forgot
                <Text style={{ fontWeight: "bold" }}> Password?</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {/* Circle View */}
        <Animated.View
          style={[
            styles.authCircleStyle,
            {
              left:
                this.state.circlePosition.x + EXPANDED_BUTTON_WIDTH / 2 - 20,
              top: this.state.circlePosition.y + 20,
              transform: [{ scale }],
              opacity: this.state.circleOpacity
            }
          ]}
        />
        <ForgotPasswordModal
          visible={this.state.visible}
          onClose={() => {
            this.setState({ visible: false });
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    loading: state.auth.loading,
    error: state.auth.error,
    authorized: state.auth.authorized,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateLoginInfo: updateLoginInfo,
      loginUser: loginUser,
      fetchEvents: fetchEvents,
      fetchUserEvents: fetchUserEvents
    },
    dispatch
  );
};

const styles = {
  container: {
    height: screenHeight,
    backgroundColor: "white"
  },
  logoStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  },
  logoContainer: {
    width: 35,
    height: 42,
    paddingBottom: 8
  },
  inputStyle: {
    borderBottomColor: "red"
  },
  headerContainer: {
    marginTop: screenHeight * 0.04,
    marginLeft: screenWidth * 0.04,
    paddingBottom: screenHeight * 0.05
  },
  passwordContainer: {
    width: screenWidth * 0.7,
    alignSelf: "center",
    marginTop: screenHeight * 0.07,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  buttonContainer: {
    marginTop: screenHeight * 0.08,
    alignSelf: "center"
  },
  container: {
    flex: 1
  },
  background: {
    position: "absolute",
    height: "100%",
    width: "100%",
    opacity: 0.9
  },
  gradient: {
    height: "100%",
    width: "100%",
    position: "absolute"
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize: 35,
    color: "white",
    marginTop: 80,
    letterSpacing: 2,
    alignSelf: "center"
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 50
  },
  inputStyle: {
    backgroundColor: "transparent",
    color: "white"
  },
  loginButtonStyle: {
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    height: 40,
    width: "100%"
  },
  loginTextStyle: {
    color: "white",
    padding: 10
  },
  bottomTextStyle: {
    color: "rgba(255,255,255,0.8)",
    marginBottom: 40,
    marginTop: 40,
    alignSelf: "center",
    fontSize: 12
  },
  loaderStyle: {
    position: "absolute",
    width: 40,
    height: 39
  },
  authCircleStyle: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 20
  },
  backgroundOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,.4)"
  },
  splurgeTextStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain",
    opacity: 0.9
  },
  headerLogoContainer: {
    marginTop: screenHeight * 0.1,
    height: screenHeight * 0.1,
    width: "90%",
    alignSelf: "center"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
