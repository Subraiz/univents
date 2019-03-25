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
  Alert,
  ScrollView
} from "react-native";
import Terms from "../constants/Terms";

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
          <View style={styles.mainContent}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "600",
                marginTop: 15
              }}
            >
              Privacy & Terms
            </Text>
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "#E7E7E7",
                marginTop: 8
              }}
            />
            <View style={{ height: "85%" }}>
              <ScrollView
                style={{
                  padding: 20
                }}
              >
                <Text>{terms}</Text>
              </ScrollView>
            </View>
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "#E7E7E7",
                marginTop: 8
              }}
            />
            <Button title="Got It" onPress={this.props.onClose} />
          </View>
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
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.3)"
  },
  mainContent: {
    height: screenHeight * 0.85,
    width: screenWidth * 0.85,
    backgroundColor: "white",
    borderRadius: 35
  }
};

export default PrivacyModal;
