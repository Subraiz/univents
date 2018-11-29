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
  pickImage() {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        source = { uri: response.uri };

        this.props.updateUserInfo({ prop: "avatarSource", value: source });
        this.props.uploadImage(response.uri, "image/jpeg", "Avatar");
      }
    });
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
        <View
          style={{
            alignItems: "center",
            marginTop: 25
          }}
        >
          <Image
            borderRadius={100}
            source={this.props.avatarSource}
            style={{ width: 200, height: 200, marginBottom: 10 }}
          />
          <Button
            title="Add Profile Picture"
            onPress={this.pickImage.bind(this)}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignUpInterests")}
            alignItems="center"
          >
            <View
              style={{
                width: screenWidth * 0.7,
                backgroundColor: "red",
                alignItems: "center",
                borderRadius: 7
              }}
            >
              <Text style={{ color: "white", padding: 20, fontSize: 18 }}>
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
