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
  Platform,
  Alert
} from "react-native";
import Terms from "../../constants/Terms.js";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import SCHOOLS from "../../constants/schools";
import { Button } from "../../components/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateUserInfo,
  checkForSignUpErrors,
  signUpUser,
  saveUser
} from "../../redux/actions/LoginActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SignUpForm extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  state = {
    emailExtension: "@"
  };

  componentWillMount() {
    for (var i = 0; i < SCHOOLS.length; i++) {
      let school = SCHOOLS[i];
      if (
        school.school.trim().toLowerCase() ==
        this.props.school.trim().toLowerCase()
      ) {
        this.setState({ emailExtension: school.email });
      }
    }
  }

  onButtonPress = async () => {
    this.props.navigation.navigate("SignUpAbout");
    // await this.props.checkForSignUpErrors(
    //   this.props.user,
    //   this.state.emailExtension
    // );
    //
    // if (this.props.error == "No Error") {
    //   await this.props.signUpUser(this.props.email, this.props.password);
    //   if (this.props.uid) {
    //     this.props.navigation.navigate("SignUpAbout");
    //   }
    // }
  };

  renderErrorEmailMessage() {
    if (this.props.error == "invalidEmail") {
      return (
        <FormValidationMessage>
          Please enter your proper school email
        </FormValidationMessage>
      );
    } else if (this.props.error == "inUseEmail") {
      return (
        <FormValidationMessage>
          That email is already being used
        </FormValidationMessage>
      );
    }
  }

  async onTermsPress() {
    Alert.alert(
      "Terms & Policies",
      Terms,
      [
        {
          text: "Agree",
          onPress: async () => {}
        }
      ],
      { cancelable: false }
    );
  }

  renderErrorPasswordMessage() {
    if (this.props.error == "passwordsDontMatch") {
      return (
        <FormValidationMessage>Password's Do Not Match</FormValidationMessage>
      );
    }
    if (this.props.error == "passwordTooShort") {
      return (
        <FormValidationMessage>
          Password must be at least 6 characters
        </FormValidationMessage>
      );
    }
  }

  renderContinue() {
    return (
      <View style={styles.buttonContainer}>
        <Button onPress={this.onButtonPress} title={"Sign Up"} />
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Create Your Account</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <FormLabel>Email</FormLabel>
          <FormInput
            placeholder={"student@bc.edu"}
            containerStyle={styles.inputStyle}
            keyboardType={"email-address"}
            autoCapitalize={"none"}
            onChangeText={text =>
              this.props.updateUserInfo({ prop: "email", value: text })
            }
            value={this.props.email}
          />
          {this.renderErrorEmailMessage()}

          <FormLabel>Password</FormLabel>
          <FormInput
            placeholder={"••••••"}
            secureTextEntry
            containerStyle={styles.inputStyle}
            value={this.props.password}
            onChangeText={text =>
              this.props.updateUserInfo({ prop: "password", value: text })
            }
          />

          <FormLabel>Confirm Password</FormLabel>
          <FormInput
            placeholder={"••••••"}
            secureTextEntry
            containerStyle={styles.inputStyle}
            value={this.props.confirmPassword}
            onChangeText={text =>
              this.props.updateUserInfo({
                prop: "confirmPassword",
                value: text
              })
            }
          />
          {this.renderErrorPasswordMessage()}
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.termsContainer}>
            <Text style={styles.termsTextStyle}>
              By signing up, you accept Splurge's
            </Text>
            <TouchableOpacity onPress={this.onTermsPress.bind(this)}>
              <Text style={{ color: "blue" }}>Terms of Service</Text>
            </TouchableOpacity>
            <Text> and </Text>
            <TouchableOpacity onPress={this.onTermsPress.bind(this)}>
              <Text style={{ color: "blue" }}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          {this.renderContinue()}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    email: state.user.email,
    password: state.user.password,
    confirmPassword: state.user.confirmPassword,
    error: state.user.error,
    uid: state.user.uid,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    school: state.user.school
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUserInfo: updateUserInfo,
      checkForSignUpErrors: checkForSignUpErrors,
      signUpUser: signUpUser,
      saveUser: saveUser
    },
    dispatch
  );
};

const styles = {
  container: {
    flex: 1,
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
    paddingBottom: 4
  },
  inputStyle: {
    borderBottomColor: "black"
  },
  headerContainer: {
    marginTop: screenHeight * 0.04,
    marginLeft: screenWidth * 0.04,
    paddingBottom: screenHeight * 0.05
  },
  termsContainer: {
    width: screenWidth * 0.7,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 20
  },
  termsTextStyle: {
    textAlign: "center",
    fontFamily: "PublicSans-Regular",
    fontSize: 16
  },
  buttonContainer: {
    alignSelf: "center"
  },
  headerTitleContainer: {
    marginTop: screenHeight * 0.07,
    paddingLeft: 18
  },
  headerTitle: {
    fontFamily: "PublicSans-Bold",
    fontSize: 20
  },
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 25
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm);
