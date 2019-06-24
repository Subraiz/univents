import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  Platform,
  Alert
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
    showModal: false,
    eventLink: "",
    eventLinks: []
  };

  renderCharacterCounter() {
    let countString = `${this.props.eventDescription.length}/300`;
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

  addLink() {
    let eventLink = this.state.eventLink;
    const validURL = this.validURL(eventLink);
    if (!eventLink.includes("https://") || !eventLink.includes("http://")) {
      eventLink = "https://" + eventLink;
    }
    if (validURL) {
      this.state.eventLinks.push(eventLink);
      this.setState({
        eventLink: ""
      });
      this.props.updateEventInfo({
        prop: "eventLinks",
        value: this.state.eventLinks
      });
      console.log(this.props.eventLinks);
    } else {
      Alert.alert(
        "Error",
        `Please enter a valid url.`,
        [
          {
            text: "Got It",
            onPress: () => {}
          }
        ],
        { cancelable: false }
      );
    }
  }

  validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  onDeleteEvent(index) {
    console.log("hey");
    Alert.alert(
      "Warning",
      `Would you like to remove ${this.state.eventLinks[index]}?`,
      [
        {
          text: "Delete",
          onPress: () => {
            console.log("before", this.state.eventLinks);
            this.state.eventLinks.splice(index, 1);
            console.log("after", this.state.eventLinks);
            this.forceUpdate();
          }
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  renderLinks() {
    return this.state.eventLinks.map((link, i) => {
      return (
        <TouchableOpacity
          style={styles.linkCardStyle}
          key={i}
          onPress={this.onDeleteEvent.bind(this, i)}
        >
          <Text style={styles.linkStyle} numberOfLines={1}>
            {link}
          </Text>
        </TouchableOpacity>
      );
    });
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
                placeholder="Event Description"
                value={this.props.eventDescription}
                spellCheck={true}
                multiline={true}
                maxLength={300}
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

          <View style={styles.cardContainer}>
            <View style={styles.linksContainer}>
              <TextInput
                style={{ marginLeft: 10 }}
                placeholder="Additional Links"
                value={this.state.eventLink}
                spellCheck={false}
                onChange={text =>
                  this.setState({ eventLink: text.nativeEvent.text })
                }
              />
              <TouchableOpacity
                style={styles.linkButtonStyle}
                onPress={this.addLink.bind(this)}
              >
                <Icon name="add-circle-outline" color={"orange"} />
              </TouchableOpacity>
              <View style={styles.linksInfoContainer}>
                {this.renderLinks()}
              </View>
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
    tempEventImage,
    eventLinks
  } = state.event;
  return {
    event: state.event,
    eventImage: eventImage,
    eventDescription: eventDescription,
    eventCategories: eventCategories,
    tempEventImage: tempEventImage,
    uid: state.user.uid,
    eventLinks: eventLinks
  };
};

const styles = {
  cardContainer: {
    alignItems: "center",
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "black",
    shadowRadius: 4,
    shadowOpacity: 0.3
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
    height: screenHeight * 0.2,
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
    shadowOpacity: 0.3
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
  },
  linksContainer: {
    width: screenWidth * 0.95,
    paddingTop: 10,
    height: screenHeight * 0.1,
    backgroundColor: "white",
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between"
  },
  linkButtonStyle: {
    alignSelf: "flex-end",
    marginRight: 8,
    marginBottom: 6
  },
  linksInfoContainer: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: "#f7f7f7",
    flexDirection: "row"
  },
  linkStyle: {
    color: "white"
  },
  linkCardStyle: {
    flex: 1,
    maxWidth: screenWidth * 0.25,
    backgroundColor: "orange",
    marginLeft: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 30
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen2);
