import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import QRCodeScannerModal from "./QRCodeScannerModal";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let event = {};
let navigatable = {};

class AdminTools extends Component {
  static navigationOptions = {
    title: "Admin Tools",
    gesturesEnabled: false
  };

  state = {
    scannerActive: false
  };

  componentWillMount() {
    const { navigation } = this.props;
    event = navigation.getParam("data", "NO-DATA");
  }

  onPress() {
    this.setState({ scannerActive: !this.state.scannerActive });
  }

  checkIfAttending(userData) {
    var i;
    for (i = 0; i < event.eventData.usersAttended.length; i++) {
      if (event.eventData.usersAttended[i].uid === userData.uid) {
        return true;
      }
    }
    return false;
  }

  onRead(userData) {
    let alreadyAttending = this.checkIfAttending(userData);
    if (!alreadyAttending) {
      event.addUserAttended(userData);

      this.scanner.showMessage();
    } else {
      this.scanner.showErrorMessage();
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.onPress.bind(this)}
        >
          <Text style={{ color: "navy", fontWeight: "600" }}>
            Track Attendance
          </Text>
        </TouchableOpacity>
        <QRCodeScannerModal
          ref={scanner => {
            this.scanner = scanner;
          }}
          value={this.props.uid}
          visible={this.state.scannerActive}
          onPress={this.onPress.bind(this)}
          onRead={this.onRead.bind(this)}
        />
      </View>
    );
  }
}

const styles = {
  buttonContainer: {
    width: screenWidth * 0.9,
    padding: 15,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "white",
    alignSelf: "center",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    borderRadius: 25
  }
};

export default AdminTools;
