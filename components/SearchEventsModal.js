import React, { Component } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  UIManager,
  SafeAreaView
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SearchEventsModal extends Component {
  render() {
    return (
      <Modal
        visible={this.props.visible}
        animationType="slide"
        onRequestClose={() => {}}
        transparent={true}
      >
        <SafeAreaView style={{ marginTop: screenHeight * 0.05 }}>
          <View style={{ backgroundColor: "black" }} />
        </SafeAreaView>
      </Modal>
    );
  }
}

export default SearchEventsModal;
