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
  LayoutAnimation
} from "react-native";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import { Button } from "../../components/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateLoginInfo, loginUser } from "../../redux/actions/LoginActions";
import { fetchEvents } from "../../redux/actions/EventsActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class LoginForm extends Component {
  renderErrorMessage() {
    if (this.props.error != "") {
      return (
        <FormValidationMessage>
          Incorrect Email or Password
        </FormValidationMessage>
      );
    }
  }

  async onPress() {
    if (this.props.email && this.props.password) {
      await this.props.loginUser(this.props.email, this.props.password);
      await this.props.fetchEvents("MA", null, this.props.user);
      if (this.props.authorized) {
        this.props.navigation.navigate("AppNavigator");
      }
    }
  }

  renderButton() {
    if (this.props.loading) {
      return <Text>Loading</Text>;
    }
    return <Button onPress={this.onPress.bind(this)} title="Login" />;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logoStyle}
                source={require("../../assets/images/UniventsLogo.png")}
              />
            </View>
            <Text>Login</Text>
          </View>
          <KeyboardAvoidingView>
            <FormLabel>Email</FormLabel>
            <FormInput
              containerStyle={styles.inputStyle}
              onChangeText={text =>
                this.props.updateLoginInfo({ prop: "email", value: text })
              }
              value={this.props.email}
            />

            <FormLabel>Password</FormLabel>
            <FormInput
              secureTextEntry
              containerStyle={styles.inputStyle}
              onChangeText={text =>
                this.props.updateLoginInfo({ prop: "password", value: text })
              }
              value={this.props.password}
            />
            {this.renderErrorMessage()}
          </KeyboardAvoidingView>

          <View style={styles.passwordContainer}>
            <TouchableOpacity>
              <Text style={{ color: "blue" }}>Forgot Password</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>{this.renderButton()}</View>
        </TouchableOpacity>
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
      fetchEvents: fetchEvents
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
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
