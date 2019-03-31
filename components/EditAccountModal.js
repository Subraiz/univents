import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Button,
  TextInput
} from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
import LottieView from "lottie-react-native";
import CacheImage from "./common/CacheImage";
import { TextField } from "react-native-material-textfield";
import { dimensions } from "../constants/Dimensions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class EditAccountModal extends Component {
  initialState = {
    avatarSource: this.props.avatarSource.uri,
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    year: this.props.year,
    major: this.props.major
  };
  state = {
    avatarSource: this.props.avatarSource.uri,
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    year: this.props.year,
    major: this.props.major,
    selectedIndex: 0
  };
  classYears = ["Freshman", "Sophomore", "Junior", "Senior"];

  componentWillMount() {
    classYears = ["Freshman", "Sophomore", "Junior", "Senior"];
    let selectedIndex = classYears.indexOf(this.props.year);
    this.setState({ selectedIndex: selectedIndex });
  }

  async _handleAccount(request) {
    if (request == "cancel") {
      this.setState(this.initialState);
      this.props.onClose();
    } else {
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
              style={styles.cancelButtonStyle}
              onPress={this._handleAccount.bind(this, "cancel")}
            >
              <Text style={styles.buttonTextStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButtonStyle}
              onPress={this._handleAccount.bind(this, "save")}
            >
              <Text style={styles.buttonTextStyle}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.accountInfo}>
            <View style={styles.profilePicContainer}>
              <CacheImage
                style={styles.profilePic}
                uri={this.state.avatarSource}
              />
              <TouchableOpacity style={styles.overlayPicContainer}>
                <Image
                  style={styles.overlayPic}
                  source={require("../assets/images/editProfileOverlay.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.nameContainer}>
              <View style={{ marginTop: 3 }}>
                <Text
                  style={{ color: "grey", fontWeight: "600", fontSize: 12 }}
                >
                  First Name
                </Text>
                <TextInput
                  value={this.state.firstName}
                  style={styles.nameStyle}
                  onChangeText={text => this.setState({ firstName: text })}
                />
              </View>
              <View style={{ marginTop: 3 }}>
                <Text
                  style={{ color: "grey", fontWeight: "600", fontSize: 12 }}
                >
                  Last Name
                </Text>
                <TextInput
                  style={styles.nameStyle}
                  value={this.state.lastName}
                  onChangeText={text => this.setState({ lastName: text })}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 15,
                alignSelf: "flex-start",
                marginLeft: 10
              }}
            >
              <Text style={{ color: "grey", fontWeight: "600", fontSize: 12 }}>
                Major
              </Text>
              <TextInput
                style={styles.majorStyle}
                value={this.state.major}
                onChangeText={text => this.setState({ major: text })}
              />
            </View>
            <View
              style={{
                width: screenWidth * 0.9,
                marginTop: 20,
                alignSelf: "center"
              }}
            >
              <SegmentedControlTab
                tabStyle={{
                  padding: 10,
                  backgroundColor: "white"
                }}
                tabContainerStyle={{ borderColor: "red" }}
                tabTextStyle={{ color: "orange" }}
                activeTabTextStyle={{ color: "black" }}
                activeTabStyle={{ backgroundColor: "#E7E7E7" }}
                values={this.classYears}
                selectedIndex={this.state.selectedIndex}
                onTabPress={index => {
                  this.setState({
                    selectedIndex: index,
                    year: this.classYears[index]
                  });
                }}
              />
            </View>

            <LottieView
              source={require("../assets/animations/accountAnimation.json")}
              style={{
                width: screenWidth * 0.4,
                alignSelf: "center",
                bottom: 10,
                position: "absolute"
              }}
              autoPlay
              loop
            />
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
    backgroundColor: "white"
  },
  cancelButtonStyle: {
    marginLeft: 15,
    width: "auto",
    alignSelf: "flex-start"
  },
  saveButtonStyle: {
    right: 15,
    width: "auto",
    alignSelf: "flex-end",
    position: "absolute"
  },
  buttonTextStyle: {
    color: "rgb(0, 122, 255)",
    fontSize: 16
  },
  header: {
    height: screenHeight * 0.05,
    borderBottomWidth: 1.5,
    borderBottomColor: "#E7E7E7",
    justifyContent: "center"
  },
  accountInfo: {
    flex: 1
  },
  profilePicContainer: {
    overflow: "hidden",
    alignSelf: "center",
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    borderRadius: [screenWidth * 0.4] / 2,
    marginTop: 10
  },
  profilePic: {
    width: null,
    height: null,
    flex: 1
  },
  overlayPicContainer: {
    position: "absolute",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,.4)",
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    borderRadius: [screenWidth * 0.4] / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  overlayPic: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    opacity: 0.8
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#E7E7E7"
  },
  nameStyle: {
    width: screenWidth * 0.45,
    paddingLeft: 3,
    paddingTop: 5,
    paddingBottom: 1,
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: "orange"
  },
  majorStyle: {
    paddingLeft: 3,
    paddingTop: 5,
    paddingBottom: 1,
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: "orange",
    width: screenWidth * 0.95
  }
};

export default connect(null)(EditAccountModal);
