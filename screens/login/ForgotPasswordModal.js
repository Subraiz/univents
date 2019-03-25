import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Button,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { resetUserPassword } from "../../redux/actions/LoginActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class ForgotPasswordModal extends Component {
  state = {
    email: ""
  };

  onChangeText(text) {
    this.setState({ email: text });
  }

  async onPasswordReset() {
    Alert.alert(
      "Password Rest",
      "We've sent you an email with further instructions to reset your password.",
      [
        {
          text: "Got It",
          onPress: () => {
            this.props.onClose();
          }
        }
      ],
      { cancelable: false }
    );
  }

  async _handleForgotPassword(request) {
    if (request == "cancel") {
      this.props.onClose();
    } else {
      let success = await this.props.resetUserPassword(this.state.email);
      this.onPasswordReset();
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        animationType="slide"
        onRequestClose={() => {}}
        transparent={true}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this._handleForgotPassword.bind(this, "cancel")}
            >
              <Text style={styles.buttonTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mainContent}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                marginTop: 15,
                fontFamily: "arial",
                color: "black",
                marginLeft: 10
              }}
            >
              Enter your Splurge email
            </Text>
            <View>
              <TextInput
                placeholder=""
                autoFocus={true}
                style={{
                  fontSize: 16,
                  marginLeft: 8,
                  marginTop: 20,
                  borderRadius: 15,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  width: screenWidth * 0.75,
                  borderWidth: 1,
                  borderColor: "red"
                }}
                value={this.state.email}
                onChangeText={text => this.onChangeText(text)}
              />
              <View>
                <TouchableOpacity
                  style={styles.resetButtonStyle}
                  onPress={this._handleForgotPassword.bind(this, "reset")}
                >
                  <Text
                    style={{
                      color: "white",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      fontWeight: "600",
                      fontSize: 16
                    }}
                  >
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ resetUserPassword: resetUserPassword }, dispatch);
};

const styles = {
  container: {
    flex: 1,
    height: screenHeight,
    backgroundColor: "white"
  },
  header: {
    height: screenHeight * 0.05,
    borderBottomWidth: 1.5,
    borderBottomColor: "#E7E7E7",
    justifyContent: "center"
  },
  buttonStyle: {
    marginLeft: 15,
    width: "auto",
    alignSelf: "flex-start"
  },
  buttonTextStyle: {
    color: "rgb(0, 122, 255)",
    fontSize: 16
  },
  mainContent: {
    flex: 1
  },
  resetButtonStyle: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 30
  }
};

export default connect(
  null,
  mapDispatchToProps
)(ForgotPasswordModal);
