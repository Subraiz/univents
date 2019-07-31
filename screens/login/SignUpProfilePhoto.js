import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
  Picker,
  UIManager,
  LayoutAnimation,
  Dimensions,
  Platform
} from "react-native";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUserInfo, uploadImage } from "../../redux/actions/LoginActions";
import RNFetchBlob from "rn-fetch-blob";
import LottieView from "lottie-react-native";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.Blob = Blob;
let imageURL;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let auth;
let storage;

const options = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images"
  },
  allowsEditing: true
};

class SignUpProfilePhoto extends Component {
  state = {
    selected: false
  };

  pickImage() {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        source = { uri: response.uri };

        this.setState({ selected: true });
        this.props.updateUserInfo({ prop: "avatarSource", value: source });
        this.props.uploadImage(response.uri, "image/jpeg", "Avatar");
      }
    });
  }

  renderImage() {
    return (
      <Image
        style={{ width: 300, height: 300 }}
        borderRadius={150}
        source={this.props.avatarSource}
      />
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          flexDirection: "column"
        }}
      >
        <TouchableOpacity
          onPress={this.pickImage.bind(this)}
          style={{
            alignItems: "center",
            marginTop: 25
          }}
        >
          {this.renderImage()}
          <Button
            title="Add Profile Picture"
            onPress={this.pickImage.bind(this)}
          />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignUpInterests")}
            alignItems="center"
          >
            <View
              style={{
                width: screenWidth * 0.7,
                backgroundColor: "black",
                alignItems: "center",
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: "white",
                  padding: 20,
                  fontSize: 18,
                  fontWeight: "500"
                }}
              >
                Next
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    avatarSource: state.user.avatarSource
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUserInfo: updateUserInfo,
      uploadImage: uploadImage
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpProfilePhoto);
