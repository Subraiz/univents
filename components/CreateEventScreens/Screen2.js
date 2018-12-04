import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Keyboard
} from "react-native";
import { Icon } from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import CategoriesModal from "./CategoriesModal";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventInfo, uploadImage } from "../../redux/actions/EventActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const options = {
  title: "Select Event Image",
  storageOptions: {
    skipBackup: true,
    path: "images"
  },
  allowsEditing: true
};

class Screen2 extends Component {
  state = {
    eventImage: this.props.tempEventImage,
    showModal: false
  };

  renderCharacterCounter() {
    let countString = `${this.props.eventDescription.length}/500`;
    return <Text style={{ color: "lightgrey" }}>{countString}</Text>;
  }

  onShowCategoriesModal() {
    this.setState({ showModal: true });
  }

  onClose() {
    this.setState({ showModal: false });
  }

  pickImage() {
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        source = { uri: response.uri };
        this.props.updateEventInfo({ prop: "tempEventImage", value: source });
        this.props.uploadImage(
          response.uri,
          "image/jpeg",
          "EventImage",
          this.props.uid
        );
        this.setState({ eventImage: source });
      }
    });
  }

  renderImage() {
    if (
      this.state.eventImage.uri ==
      "http://aooevents.com/wp-content/themes/invictus_3.3/images/dummy-image.jpg"
    ) {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Icon name="add" color={"grey"} />
          <Text style={{ marginTop: 5, color: "grey" }}>
            Upload From Photos
          </Text>
        </View>
      );
    } else {
      return (
        <Image source={this.props.tempEventImage} style={styles.imageStyle} />
      );
    }
  }

  renderCategories() {
    if (this.props.eventCategories.length == 0) {
      return <Text style={{ color: "lightgrey" }}>Categories</Text>;
    } else {
      let categoriesString;
      for (var i = 0; i < this.props.eventCategories.length; i++) {
        if (i == 0) {
          categoriesString = this.props.eventCategories[i];
        } else {
          categoriesString += `, ${this.props.eventCategories[i]}`;
        }
      }
      return <Text>{categoriesString}</Text>;
    }
  }

  render() {
    let animation =
      this.props.animation == "right" ? "slideInRight" : "slideInLeft";
    return (
      <Animatable.View animation={animation} duration={400}>
        <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.onShowCategoriesModal.bind(this)}
              style={styles.categoryContainer}
            >
              {this.renderCategories()}
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <TextInput
                style={{ height: "100%" }}
                placeholder="Event Description"
                value={this.props.eventDescription}
                spellCheck={true}
                multiline={true}
                maxLength={500}
                onChange={text =>
                  this.props.updateEventInfo({
                    prop: "eventDescription",
                    value: text.nativeEvent.text
                  })
                }
              />
            </View>
            <View
              style={{ alignSelf: "flex-end", marginTop: -25, marginRight: 20 }}
            >
              {this.renderCharacterCounter()}
            </View>
          </View>

          <View style={styles.secondContaienr}>
            <TouchableOpacity
              onPress={this.pickImage.bind(this)}
              style={styles.imageContainer}
            >
              {this.renderImage()}
            </TouchableOpacity>
            <View style={styles.instructionsContainer}>
              <Text
                style={{
                  marginBottom: 4,
                  color: "grey",
                  fontStyle: "italic",
                  fontSize: 16,
                  fontWeight: "500"
                }}
              >
                Upload Photo
              </Text>
              <Text style={{ marginBottom: 4, color: "grey" }}>
                Recommended Size
              </Text>
              <Text style={{ marginBottom: 4, color: "grey" }}>
                375 x 135 px
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 30
            }}
          >
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.props.onReturn}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Return</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.props.onPress}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Next</Text>
            </TouchableOpacity>
          </View>
          <CategoriesModal
            onPress={this.onClose.bind(this)}
            visible={this.state.showModal}
          />
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { updateEventInfo: updateEventInfo, uploadImage: uploadImage },
    dispatch
  );
};

const mapStateToProps = state => {
  let {
    eventImage,
    eventDescription,
    eventCategories,
    tempEventImage
  } = state.event;
  return {
    event: state.event,
    eventImage: eventImage,
    eventDescription: eventDescription,
    eventCategories: eventCategories,
    tempEventImage: tempEventImage,
    uid: state.user.uid
  };
};

const styles = {
  cardContainer: {
    alignItems: "center",
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "black",
    shadowRadius: 4,
    shadowOpacity: 0.6
  },
  categoryContainer: {
    width: screenWidth * 0.95,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  infoContainer: {
    width: screenWidth * 0.95,
    paddingTop: 10,
    height: screenHeight * 0.3,
    backgroundColor: "white",
    paddingLeft: 10
  },
  buttonStyle: {
    alignSelf: "center",
    width: 100,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "red",
    borderRadius: 15,
    alignItems: "center"
  },
  imageContainer: {
    width: 150,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey"
  },
  secondContaienr: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    width: screenWidth * 0.95,
    alignSelf: "center",
    marginTop: 20,
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "black",
    shadowRadius: 4,
    shadowOpacity: 0.6
  },
  instructionsContainer: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: screenWidth * 0.07
  },
  imageStyle: {
    width: "100%",
    height: "100%"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen2);
