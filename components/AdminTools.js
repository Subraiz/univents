import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import QRCodeScannerModal from "./QRCodeScannerModal";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class AdminTools extends Component {
  static navigationOptions = {
    title: "Admin Tools",
    gesturesEnabled: false
  };

  state = {
    scannerActive: false
  };

  onPress() {
    this.setState({ scannerActive: !this.state.scannerActive });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
        <TouchableOpacity
          style={styles.buttonContainerA}
          onPress={this.onPress.bind(this)}
        >
          <Text style={{ color: "navy" }}>Track Attendance</Text>
        </TouchableOpacity>
        <QRCodeScannerModal
          value={this.props.uid}
          visible={this.state.scannerActive}
          onPress={this.onPress.bind(this)}
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
