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
  Platform
} from "react-native";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import { Button } from "../../components/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateUserInfo,
  checkForSignUpErrors,
  signUpUser
} from "../../redux/actions/LoginActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SignUpForm extends Component {
  onButtonPress = async () => {
    //this.props.navigation.navigate("SignUpPersonalInfo");
    await this.props.checkForSignUpErrors(this.props.user);

    if (this.props.error == "No Error") {
      await this.props.signUpUser(this.props.email, this.props.password);
      if (this.props.uid) {
        this.props.navigation.navigate("SignUpPersonalInfo");
      }
    }
  };

  static navigationOptions = {
    title: "Create An Account",
    gesturesEnabled: false,
    headerRight: (
      <View
        style={{
          width: 35,
          height: 42,
          padding: 8,
          marginRight: 8
        }}
      >
        <Image
          style={{
            flex: 1,
            width: null,
            height: null,
            resizeMode: "contain"
          }}
          source={require("../../assets/images/UniventsLogo.png")}
        />
      </View>
    )
  };

  renderErrorEmailMessage() {
    if (this.props.error == "invalidEmail") {
      return (
        <FormValidationMessage>
          Please enter a valid email
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
        <Button onPress={this.onButtonPress} title={"Continue"} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView>
            <View style={{ marginTop: 10 }}>
              <FormLabel>First Name</FormLabel>
              <FormInput
                autoCorrect={false}
                containerStyle={styles.inputStyle}
                onChangeText={text =>
                  this.props.updateUserInfo({ prop: "firstName", value: text })
                }
                value={this.props.firstName}
              />
              <FormLabel>Last Name</FormLabel>
              <FormInput
                autoCorrect={false}
                containerStyle={styles.inputStyle}
                onChangeText={text =>
                  this.props.updateUserInfo({ prop: "lastName", value: text })
                }
                value={this.props.lastName}
              />
              <FormLabel>Email</FormLabel>
              <FormInput
                containerStyle={styles.inputStyle}
                onChangeText={text =>
                  this.props.updateUserInfo({ prop: "email", value: text })
                }
                value={this.props.email}
              />
              {this.renderErrorEmailMessage()}

              <FormLabel>Password</FormLabel>
              <FormInput
                secureTextEntry
                containerStyle={styles.inputStyle}
                value={this.props.password}
                onChangeText={text =>
                  this.props.updateUserInfo({ prop: "password", value: text })
                }
              />

              <FormLabel>Confirm Password</FormLabel>
              <FormInput
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
          </KeyboardAvoidingView>

          {this.renderContinue()}

          <View style={styles.termsContainer}>
            <Text style={styles.termsTextStyle}>
              By signing up, you accept Univent’s
            </Text>
            <TouchableOpacity>
              <Text style={{ color: "blue" }}>Terms of Service</Text>
            </TouchableOpacity>
            <Text> and </Text>
            <TouchableOpacity>
              <Text style={{ color: "blue" }}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
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
    lastName: state.user.lastName
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUserInfo: updateUserInfo,
      checkForSignUpErrors: checkForSignUpErrors,
      signUpUser: signUpUser
    },
    dispatch
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    height: screenHeight
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
    borderBottomColor: "red"
  },
  headerContainer: {
    marginTop: screenHeight * 0.04,
    marginLeft: screenWidth * 0.04,
    paddingBottom: screenHeight * 0.05
  },
  termsContainer: {
    marginTop: screenHeight * 0.03,
    width: screenWidth * 0.7,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  termsTextStyle: {
    textAlign: "center",
    fontSize: 16
  },
  buttonContainer: {
    marginTop: screenHeight * 0.03,
    alignSelf: "center"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm);
