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
import Terms from "../consants/Terms";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let terms = Terms;

class PrivacyModal extends Component {
  render() {
    return (
      <Modal
        visible={this.props.visible}
        animationType="slide"
        onRequestClose={() => {}}
        transparent={true}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.mainContent} />
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center"
  },
  mainContent: {
    height: screenHeight * 0.75,
    width: screenWidth * 0.85,
    backgroundColor: "white",
    borderRadius: 35
  }
};

export default PrivacyModal;
