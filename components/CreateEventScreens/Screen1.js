import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Picker,
  ScrollView,
  Platform,
  Image,
  UIManager,
  LayoutAnimation,
  Animated
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ImagePicker from "react-native-image-picker";
import CategoriesModal from "./CategoriesModal";
import Icon from "react-native-vector-icons/Ionicons";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import { Button } from "../common";
import * as Animatable from "react-native-animatable";
import DateTimeModal from "./DateTimeModal";
import LocationModal from "./LocationModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCategories } from "../../redux/actions/SettingsActions";
import { updateEventInfo, uploadImage } from "../../redux/actions/EventActions";
import SCHOOLS from "../../constants/schools";

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

const CardSection = props => {
  return <View style={styles.cardContainer}>{props.children}</View>;
};

class Screen1 extends Component {
  state = {
    switchValue: false,
    showDateTimeModal: false,
    showLocationModal: false,
    eventPinUrl: SCHOOLS.find(school => school.school === this.props.school)
      .eventPin,
    selectedIndex: 0,
    eventImage: this.props.tempEventImage,
    showModal: false,
    eventLink: "",
    eventLinks: [],
    scrollHelpOpacity: 1,
    scrollPosition: new Animated.Value(0)
  };

  componentWillMount() {
    this.props.updateEventInfo({
      prop: "eventPin",
      value: { uri: this.state.eventPinUrl }
    });
    this.props.updateEventInfo({
      prop: "eventType",
      value: this.props.school.trim()
    });
  }

  getHelperStyle() {
    const { scrollPosition } = this.state;
    const opacity = scrollPosition.interpolate({
      inputRange: [0, 30, 60],
      outputRange: [1, 0.5, 0]
    });

    return {
      opacity: opacity
    };
  }

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
          <Icon name="md-camera" style={{ fontSize: 30 }} />
          <Text style={{ marginTop: 5, fontFamily: "PublicSans-ExtraLight" }}>
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

  handleIndexChange = index => {
    this.setState({ selectedIndex: index });
    if (index == 0) {
      this.props.updateEventInfo({
        prop: "eventType",
        value: this.props.school.trim()
      });
    } else {
      this.props.updateEventInfo({ prop: "eventType", value: "Public" });
    }
  };

  onChangeText(text) {
    this.props.updateEventInfo({
      prop: "eventName",
      value: text.nativeEvent.text
    });
  }

  renderDateTime() {
    if (
      this.props.eventDate.month == "" ||
      this.props.eventTime.startTime == "" ||
      this.props.eventTime.endTime == ""
    ) {
      return (
        <TouchableOpacity
          onPress={this.onShowDateTimeModal.bind(this)}
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: "white",
            paddingBottom: 8,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "PublicSans-Bold",
              fontSize: 16
            }}
          >
            Date/Time
          </Text>
          <Icon
            name="md-add"
            style={{ color: "white", fontSize: 18, paddingRight: 5 }}
          />
        </TouchableOpacity>
      );
    } else {
      let dateString = `${this.props.eventDate.month} ${this.props.eventDate
        .day || "Event Date"}, ${this.props.eventDate.year}`;

      let startTimeArray = this.props.eventTime.startTime.split(":");
      let endTimeArray = this.props.eventTime.endTime.split(":");

      let startHour;
      let startMinute;
      let endHour;
      let endMinute;

      let startTimeOfDay = "AM";
      let endTimeOfDay = "AM";

      if (startTimeArray[0] > 12) {
        startHour = parseInt(startTimeArray[0]) - 12;
        startTimeOfDay = "PM";
      } else {
        startHour = startTimeArray[0];
      }
      let startTime = `${startHour}:${startTimeArray[1]}`;

      if (endTimeArray[0] > 12) {
        endHour = parseInt(endTimeArray[0] - 12);
        endTimeOfDay = "PM";
      } else {
        endHour = endTimeArray[0];
      }
      let endTime = `${endHour}:${endTimeArray[1]}`;

      let timeString = `${startTime}${startTimeOfDay} - ${endTime}${endTimeOfDay}`;

      return (
        <TouchableOpacity
          onPress={this.onShowDateTimeModal.bind(this)}
          style={{ marginLeft: 18, marginRight: 18, marginTop: 20 }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "PublicSans-Bold",
              fontSize: 16
            }}
          >
            {dateString}
          </Text>
          <Text
            style={{
              color: "white",
              fontFamily: "PublicSans-Bold",
              fontSize: 16
            }}
          >
            {timeString}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  renderLocationAddress() {
    if (this.props.eventLocation.locationAddress == "") {
      return (
        <TouchableOpacity
          onPress={this.onShowLocationModal.bind(this)}
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: "white",
            paddingBottom: 8,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "PublicSans-Bold",
              fontSize: 16
            }}
          >
            Location Address
          </Text>
          <Icon
            name="md-add"
            style={{ color: "white", fontSize: 18, paddingRight: 5 }}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={this.onShowLocationModal.bind(this)}
          style={{ marginLeft: 18, marginRight: 18, marginTop: 20 }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "PublicSans-Bold",
              fontSize: 16
            }}
          >
            {this.props.eventLocation.locationAddress}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  onLocationNameChange = text => {
    let eventLocation = {
      locationAddress: this.props.eventLocation.locationAddress,
      locationName: text
    };

    this.props.updateEventInfo({ prop: "eventLocation", value: eventLocation });
  };

  onShowDateTimeModal() {
    this.setState({ showDateTimeModal: true });
  }

  onCloseDateTimeModal() {
    this.setState({ showDateTimeModal: false });
  }

  onShowLocationModal() {
    this.setState({ showLocationModal: true });
  }

  onCloseLocationModal() {
    this.setState({ showLocationModal: false });
  }

  onButtonPress() {
    Alert.alert(
      "Empty Fields",
      "Please complete all required fields",
      [
        {
          text: "OK"
        }
      ],
      { cancelable: false }
    );
  }

  renderButtonFunction() {
    // if (
    //   this.props.eventName !== "" &&
    //   this.props.eventHost !== "" &&
    //   this.props.eventContact !== "" &&
    //   this.props.eventLocation.locationName !== "" &&
    //   this.props.eventLocation.locationAddress !== "" &&
    //   this.props.eventDate.month !== ""
    // ) {
    //   this.props.onPress();
    // } else {
    //   this.onButtonPress();
    // }
    this.props.onPress();
  }

  handleScroll = event => {
    console.log("scrolling");
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
  };

  render() {
    const opacity = this.state.scrollPosition.interpolate({
      inputRange: [
        0,
        screenHeight * 0.1,
        screenHeight * 0.2,
        screenHeight * 0.23
      ],
      outputRange: [1, 0.5, 0.2, 0],
      extrapolate: "clamp"
    });

    const rotate = this.state.scrollPosition.interpolate({
      inputRange: [0, screenHeight * 0.1, screenHeight * 0.2],
      outputRange: ["0deg", "90deg", "180deg"],
      extrapolate: "clamp"
    });

    let animation =
      this.props.animation == "right" ? "slideInRight" : "slideInLeft";
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          borderTopWidth: 0.5,
          borderColor: "white"
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 40,
              left: 20,
              opacity: opacity,
              zIndex: 10,
              transform: [{ rotate: rotate }]
            }
          ]}
        >
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={[styles.scrollDownContainer]}
          >
            <Animatable.View
              animation="swing"
              duration={1000}
              iterationCount="infinite"
              direction="reverse"
              easing="ease"
            >
              <Icon
                name="md-arrow-down"
                style={{ fontSize: 22, color: "white", paddingTop: 2 }}
              />
            </Animatable.View>
          </Animatable.View>
        </Animated.View>
        <KeyboardAwareScrollView
          extraScrollHeight={45}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollPosition } } }
          ])}
        >
          <Animatable.View animation={animation} duration={300}>
            <LinearGradient
              colors={["#40E488", "#2DE85D"]}
              style={{
                paddingBottom: 20,
                maxHeight: screenHeight * 0.6,
                minHeight: screenHeight * 0.4,
                marginBottom: 15
              }}
            >
              <KeyboardAvoidingView
                behavior="padding"
                keyboardShouldPersistTaps="handled"
                style={{ marginLeft: 5, marginRight: 5 }}
              >
                <FormLabel labelStyle={styles.labelStyle}>Event Name</FormLabel>
                <FormInput
                  placeholder={"My Awesome Event"}
                  placeholderTextColor="rgba(255,255,255,.8)"
                  containerStyle={styles.inputStyle}
                  inputStyle={styles.textInputStyle}
                  onChangeText={text =>
                    this.props.updateEventInfo({
                      prop: "eventName",
                      value: text
                    })
                  }
                  value={this.props.eventName}
                />

                <FormLabel labelStyle={styles.labelStyle}>
                  Location Name
                </FormLabel>
                <FormInput
                  placeholder="Location Name (ex: Vandy Cabaret Hall)"
                  placeholderTextColor="rgba(255,255,255,.8)"
                  spellCheck={false}
                  containerStyle={styles.inputStyle}
                  inputStyle={styles.textInputStyle}
                  onChangeText={text => this.onLocationNameChange(text)}
                  value={this.props.eventLocation.locationName}
                />

                <FormLabel labelStyle={styles.labelStyle}>
                  Host Infromation
                </FormLabel>
                <View style={{ flexDirection: "row", marginTop: 0 }}>
                  <FormInput
                    placeholder="Who's Hosting?"
                    placeholderTextColor="rgba(255,255,255,.8)"
                    spellCheck={false}
                    containerStyle={[styles.inputStyle, { width: "42%" }]}
                    inputStyle={styles.textInputStyle}
                    onChangeText={text =>
                      this.props.updateEventInfo({
                        prop: "eventHost",
                        value: text
                      })
                    }
                    value={this.props.eventHost}
                  />

                  <FormInput
                    placeholder="Contact Info"
                    placeholderTextColor="rgba(255,255,255,.8)"
                    spellCheck={false}
                    containerStyle={[
                      styles.inputStyle,
                      { width: "42%", marginLeft: 0 }
                    ]}
                    inputStyle={styles.textInputStyle}
                    onChangeText={text =>
                      this.props.updateEventInfo({
                        prop: "eventContact",
                        value: text
                      })
                    }
                    value={this.props.eventContact}
                  />
                </View>

                {this.renderLocationAddress()}
                {this.renderDateTime()}
              </KeyboardAvoidingView>
            </LinearGradient>
            <View
              style={{
                width: "75%",
                alignSelf: "center",
                marginBottom: 15
              }}
            >
              <SegmentedControlTab
                activeTabStyle={{ backgroundColor: "#36E671" }}
                tabStyle={{
                  borderColor: "rgba(0,0,0,0)",
                  borderRadius: 5
                }}
                tabsContainerStyle={{
                  shadowColor: "black",
                  shadowOffset: { width: -1, height: 2 },
                  shadowOpacity: 0.07,
                  shadowRadius: 6,
                  backgroundColor: "white",
                  borderWidth: 0.2,
                  borderRadius: 5,
                  overflow: "hidden"
                }}
                tabTextStyle={{
                  fontFamily: "PublicSans-Regular",
                  color: "#36E671"
                }}
                activeTabTextStyle={{ fontFamily: "PublicSans-Bold" }}
                values={[`${this.props.school}`, "Public"]}
                selectedIndex={this.state.selectedIndex}
                onTabPress={this.handleIndexChange.bind(this)}
              />
            </View>
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
                style={{
                  alignSelf: "flex-end",
                  marginTop: -25,
                  marginRight: 30
                }}
              >
                {this.renderCharacterCounter()}
              </View>
            </View>
            <View style={styles.cardContainer}>
              <View style={styles.linksContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10
                  }}
                >
                  <TextInput
                    style={{
                      marginLeft: 10,
                      borderBottomColor: "black",
                      flex: 1,
                      marginRight: 10,
                      borderBottomWidth: 0.4,
                      paddingBottom: 4
                    }}
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
                    <Icon
                      name="md-add-circle"
                      style={{ fontSize: 30, color: "#36E671" }}
                    />
                  </TouchableOpacity>
                </View>
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
                    marginBottom: 12,
                    color: "black",
                    fontSize: 16,
                    fontFamily: "PublicSans-SemiBold"
                  }}
                >
                  Upload Photo
                </Text>
                <Text
                  style={{
                    marginBottom: 4,
                    color: "black",
                    fontFamily: "PublicSans-ExtraLight",
                    fontSize: 13
                  }}
                >
                  Recommended Size
                </Text>
                <Text
                  style={{
                    marginBottom: 4,
                    color: "black",
                    fontFamily: "PublicSans-ExtraLight",
                    fontSize: 13
                  }}
                >
                  375 x 135 px
                </Text>
              </View>
            </View>

            <View
              style={{
                width: screenWidth,
                marginBottom: 30,
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "black",
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  width: "50%",
                  marginRight: 20,
                  borderRadius: 25,
                  alignSelf: "flex-end",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
                onPress={this.renderButtonFunction.bind(this)}
              >
                <Text
                  style={{
                    fontFamily: "PublicSans-SemiBold",
                    color: "white",
                    fontSize: 15
                  }}
                >
                  Review Event
                </Text>
                <Icon
                  name="md-arrow-round-forward"
                  style={{ fontSize: 22, color: "white", paddingTop: 2 }}
                />
              </TouchableOpacity>
            </View>

            <DateTimeModal
              visible={this.state.showDateTimeModal}
              onClose={this.onCloseDateTimeModal.bind(this)}
            />
            <LocationModal
              visible={this.state.showLocationModal}
              onClose={this.onCloseLocationModal.bind(this)}
            />
            <CategoriesModal
              onPress={this.onClose.bind(this)}
              visible={this.state.showModal}
            />
          </Animatable.View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateEventInfo: updateEventInfo,
      getCategories: getCategories,
      uploadImage: uploadImage
    },
    dispatch
  );
};

const mapStateToProps = state => {
  let {
    eventName,
    eventDate,
    eventTime,
    eventType,
    eventCoordinates,
    eventLocation,
    eventHost,
    eventContact,
    eventImage,
    eventDescription,
    eventCategories,
    tempEventImage,
    eventLinks
  } = state.event;
  return {
    event: state.event,
    eventName: eventName,
    eventDate: eventDate,
    eventTime: eventTime,
    eventType: eventType,
    eventCoordinates: eventCoordinates,
    eventLocation: eventLocation,
    eventHost: eventHost,
    eventContact: eventContact,
    school: state.user.school,
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
    width: screenWidth * 0.9,
    marginTop: 3,
    paddingLeft: 40,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 20
  },
  buttonStyle: {
    marginTop: 20,
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
  inputStyle: {
    borderBottomColor: "white"
  },
  textInputStyle: {
    fontFamily: "PublicSans-Regular",
    color: "white",
    fontSize: 17
  },
  labelStyle: {
    color: "white",
    fontFamily: "PublicSans-SemiBold"
  },
  scrollDownContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "black",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    shadowOpacity: 0.15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },
  // Seperate
  cardContainer: {
    alignItems: "center",
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "black",
    shadowRadius: 6,
    shadowOpacity: 0.07,
    marginTop: 5
  },
  categoryContainer: {
    width: screenWidth * 0.9,
    borderWidth: 0.2,
    borderBottomWidth: 0,
    borderColor: "rgba(0,0,0,.5)",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
    backgroundColor: "white"
  },
  infoContainer: {
    width: screenWidth * 0.9,
    paddingTop: 10,
    height: screenHeight * 0.12,
    backgroundColor: "white",
    paddingLeft: 10,
    borderWidth: 0.3,
    borderTopWidth: 0,
    borderColor: "rgba(0,0,0,.5)"
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
    width: 160,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.2,
    borderRadius: 5,
    backgroundColor: "#f7f7f7",
    borderColor: "grey",
    overflow: "hidden"
  },
  secondContaienr: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    width: screenWidth * 0.9,
    alignSelf: "center",
    marginTop: 20,
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "black",
    shadowRadius: 6,
    shadowOpacity: 0.07,
    marginBottom: 20,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: 0.3,
    borderColor: "rgba(0,0,0,.5)"
  },
  instructionsContainer: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: screenWidth * 0.04
  },
  imageStyle: {
    width: "100%",
    height: "100%"
  },
  linksContainer: {
    width: screenWidth * 0.9,
    paddingTop: 10,
    height: screenHeight * 0.1,
    backgroundColor: "white",
    marginTop: 20,
    display: "flex",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    justifyContent: "space-between",
    borderWidth: 0.2,
    borderColor: "rgba(0,0,0,.5)"
  },
  linkButtonStyle: {
    alignSelf: "flex-end",
    marginRight: 12
  },
  linksInfoContainer: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    borderBottomWidth: 0.2,
    borderColor: "rgba(0,0,0,.5)"
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
)(Screen1);
