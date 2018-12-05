import React, { Component } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class QRCodeScannerModal extends Component {
  state = {
    showMessage: false,
    userData: null,
    animation: "fadeInUp"
  };

  handleRead(data) {
    let dataArray = data.data.split(" ");
    let userData = {
      firstName: dataArray[0],
      lastName: dataArray[1],
      email: dataArray[2],
      major: dataArray[3],
      year: dataArray[4],
      sex: dataArray[5],
      ethnicity: dataArray[6],
      uid: dataArray[7],
      interests: dataArray[8]
    };
    this.props.onRead(userData);
    this.setState({ userData: userData });
  }

  showMessage() {
    this.setState({ showMessage: "success" });
  }

  showErrorMessage() {
    this.setState({ showMessage: "error" });
  }

  renderPopUp() {
    if (this.state.showMessage == "success") {
      let animation = "fadeInUp";
      setTimeout(() => {
        this.setState({ animation: "fadeOutDown" });
      }, 1000);
      setTimeout(
        () => this.setState({ showMessage: false, animation: "fadeInUp" }),
        1500
      );
      return (
        <Animatable.View
          animation={this.state.animation}
          style={{
            alignSelf: "center",
            marginTop: screenHeight * 0.06,
            paddingRight: 25,
            paddingLeft: 25,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: "green",
            borderRadius: 30
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "white" }}>
            {this.state.userData.firstName} has been marked as attended
          </Text>
        </Animatable.View>
      );
    } else if (this.state.showMessage == "error") {
      setTimeout(() => {
        this.setState({ animation: "fadeOutDown" });
      }, 1000);
      setTimeout(
        () => this.setState({ showMessage: false, animation: "fadeInUp" }),
        1500
      );
      return (
        <Animatable.View
          animation={this.state.animation}
          style={{
            alignSelf: "center",
            marginTop: screenHeight * 0.06,
            paddingRight: 25,
            paddingLeft: 25,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: "red",
            borderRadius: 30
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "white" }}>
            This user is already attending the event.
          </Text>
        </Animatable.View>
      );
    } else {
      return null;
    }
  }

  render() {
    let { containerStyle, textStyle, cardSectionStyle } = styles;
    return (
      <Modal
        visible={this.props.visible}
        animationType="slide"
        onRequestClose={() => {}}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.2)"
          }}
        >
          <View style={{ position: "absolute" }}>
            <View
              style={{
                height: screenHeight * 0.75,
                width: screenWidth * 0.9,
                alignItems: "center"
              }}
            >
              <QRCodeScanner
                containerStyle={{ height: "100%" }}
                onRead={data => this.handleRead(data)}
                reactivate={true}
                reactivateTimeout={1000}
                showMarker={true}
                fadeIn={false}
                bottomContent={
                  <TouchableOpacity
                    style={styles.buttonTouchable}
                    onPress={this.props.onPress}
                  >
                    <Icon name="close" color="blue" />
                  </TouchableOpacity>
                }
              />
            </View>
          </View>
          {this.renderPopUp()}
        </View>
      </Modal>
    );
  }
}

const styles = {
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: "white",
    shadowOffset: { width: -2, height: -2 },
    shadowColor: "black",
    shadowRadius: 0.4,
    shadowRadius: 1
  }
};

export default QRCodeScannerModal;
