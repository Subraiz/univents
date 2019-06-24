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
  TextInput,
  Picker
} from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import DateTimeModal from "./DateTimeModal";
import LocationModal from "./LocationModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventData } from "../../redux/actions/EventActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const CardSection = props => {
  return <View style={styles.cardContainer}>{props.children}</View>;
};

class EditEventModal extends Component {
  constructor(props) {
    super(props);

    const {
      eventName,
      eventLocation,
      eventHost,
      eventContact,
      eventTime,
      eventDate,
      eventOrder,
      eventCoordinates,
      canceled,
      eventCategories,
      eventData,
      eventDescription,
      eventID,
      eventImage,
      tempEventImage,
      eventType
    } = this.props.event;

    this.initialState = {
      event: this.props.event,
      eventName,
      eventLocation,
      eventHost,
      eventContact,
      eventTime,
      eventDate,
      eventOrder,
      eventCoordinates,
      canceled,
      eventCategories,
      eventData,
      eventDescription,
      eventID,
      eventImage,
      tempEventImage,
      eventType,
      showLocationModal: false,
      showDateTimeModal: false,
      dateChanged: false,
      locationChanged: false
    };

    this.state = {
      eventName,
      eventLocation,
      eventHost,
      eventContact,
      eventTime,
      eventDate,
      eventOrder,
      eventCoordinates,
      canceled,
      eventCategories,
      eventData,
      eventDescription,
      eventID,
      eventImage,
      tempEventImage,
      eventType,
      showLocationModal: false,
      showDateTimeModal: false,
      dateChanged: false,
      locationChanged: false
    };
  }

  checkIfTextChanged = () => {
    return (
      this.state.eventLocation.locationName !=
        this.initialState.eventLocation.locationName ||
      this.state.eventName != this.initialState.eventName ||
      this.state.eventHost != this.initialState.eventHost ||
      this.state.eventContact != this.initialState.eventContact ||
      this.state.eventDescription != this.initialState.eventDescription
    );
  };

  // Make save button active only if info was changed, otherwise disable it.
  renderSaveButton() {
    let infoChanged =
      this.checkIfTextChanged() ||
      this.state.locationChanged ||
      this.state.dateChanged;
    if (infoChanged) {
      return (
        <TouchableOpacity
          style={styles.saveButtonStyle}
          onPress={this._handleAccount.bind(this, "save")}
        >
          <Text style={styles.buttonTextStyle}>Save</Text>
        </TouchableOpacity>
      );
    } else
      return (
        <TouchableOpacity disabled={true} style={styles.saveButtonStyle}>
          <Text style={[styles.buttonTextStyle, { color: "grey" }]}>Save</Text>
        </TouchableOpacity>
      );
  }

  toggleLocationModal() {
    this.setState({ showLocationModal: !this.state.showLocationModal });
  }

  toggleDateTimeModal() {
    this.setState({ showDateTimeModal: !this.state.showDateTimeModal });
  }

  renderLocationAddress() {
    if (this.state.eventLocation.locationAddress == "") {
      return (
        <TouchableOpacity onPress={this.toggleLocationModal.bind(this)}>
          <Text style={{ color: "rgb(0, 122, 255)" }}>Location Address</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={this.toggleLocationModal.bind(this)}>
          <Text style={{ color: "rgb(0, 122, 255)" }}>
            {this.state.eventLocation.locationAddress}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  renderDateTime() {
    if (
      this.state.eventDate.month == "" ||
      this.state.eventTime.startTime == "" ||
      this.state.eventTime.endTime == ""
    ) {
      return (
        <TouchableOpacity onPress={this.toggleDateTimeModal.bind(this)}>
          <Text style={{ color: "rgb(0, 122, 255)" }}>Date/Time</Text>
        </TouchableOpacity>
      );
    } else {
      let dateString = `${this.state.eventDate.month} ${this.state.eventDate
        .day || "Event Date"}, ${this.state.eventDate.year}`;

      let startTimeArray = this.state.eventTime.startTime.split(":");
      let endTimeArray = this.state.eventTime.endTime.split(":");

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
        <TouchableOpacity onPress={this.toggleDateTimeModal.bind(this)}>
          <Text style={{ color: "rgb(0, 122, 255)" }}>{dateString}</Text>
          <Text style={{ color: "rgb(0, 122, 255)", marginTop: 4 }}>
            {timeString}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  setLocation(location) {
    console.log(location);
    this.setState({
      eventLocation: location.eventLocation,
      eventCoordinates: location.eventCoordinates,
      locationChanged: location.locationChanged
    });
  }

  setTime(time) {
    console.log(time);
    this.setState({
      eventDate: time.eventDate,
      eventTime: time.eventTime,
      eventOrder: time.eventOrder,
      dateChanged: time.dateChanged
    });
  }

  // Handle actions to be taking depending on button pressed.
  async _handleAccount(request) {
    if (request == "cancel") {
      this.setState(this.initialState);
      this.props.onClose();
    } else {
      let event = {
        eventName: this.state.eventName,
        eventLocation: this.state.eventLocation,
        eventHost: this.state.eventHost,
        eventContact: this.state.eventContact,
        eventTime: this.state.eventTime,
        eventDate: this.state.eventDate,
        eventOrder: this.state.eventOrder,
        eventCoordinates: this.state.eventCoordinates,
        canceled: this.state.canceled,
        eventCategories: this.state.eventCategories,
        eventData: this.state.eventData,
        eventDescription: this.state.eventDescription,
        eventID: this.state.eventID,
        eventImage: this.state.eventImage,
        tempEventImage: "",
        eventType: this.state.eventType
      };
      this.animation.play();
      await this.props.updateEventData(event, "MA");
      this.props.returnEditedEvent(event);
      // this.initialState = this.state
      // change state values of any info changed to false
      this.props.onClose();
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
            {this.renderSaveButton()}
          </View>

          <KeyboardAwareScrollView
            contentContainerStyle={{
              alignItems: "center"
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                marginTop: 10,
                flex: 1,
                paddingTop: 5,
                paddingBottom: 5,
                backgroundColor: "white",
                borderRadius: 30,
                borderWidth: 0.5,
                borderColor: "red",
                border: "2px solid orange",
                shadowOffset: { width: -4, height: 2 },
                shadowOpacity: 0.2,
                shadowColor: "orange",
                margin: 5,
                width: "90%"
              }}
            >
              <CardSection>
                <TextInput
                  placeholder="Event Name"
                  value={this.state.eventName}
                  onChange={event => {
                    this.setState({ eventName: event.nativeEvent.text });
                  }}
                />
              </CardSection>
              <CardSection>
                <TextInput
                  value={this.state.eventLocation.locationName}
                  placeholder="Location Name (ex: Vandy Cabaret Hall)"
                  onChange={event => {
                    this.setState({
                      eventLocation: {
                        locationName: event.nativeEvent.text,
                        locationAddress: this.state.eventLocation
                          .locationAddress
                      }
                    });
                  }}
                  spellCheck={false}
                />
              </CardSection>
              <CardSection>{this.renderLocationAddress()}</CardSection>
              <CardSection>{this.renderDateTime()}</CardSection>
              <CardSection>
                <TextInput
                  placeholder="Host Name"
                  value={this.state.eventHost}
                  spellCheck={false}
                  onChange={event => {
                    this.setState({ eventHost: event.nativeEvent.text });
                  }}
                />
              </CardSection>

              <CardSection>
                <TextInput
                  placeholder="Contact Info (Email or Phone Number)"
                  value={this.state.eventContact}
                  spellCheck={false}
                  onChange={event => {
                    this.setState({ eventContact: event.nativeEvent.text });
                  }}
                />
              </CardSection>
              <CardSection>
                <TextInput
                  multiline={true}
                  maxLength={300}
                  placeholder="Event Description"
                  value={this.state.eventDescription}
                  spellCheck={false}
                  onChange={event => {
                    this.setState({ eventDescription: event.nativeEvent.text });
                  }}
                />
              </CardSection>
            </View>
          </KeyboardAwareScrollView>
          <LottieView
            source={require("../../assets/animations/accountAnimation.json")}
            style={{
              width: screenWidth * 0.4,
              alignSelf: "center",
              bottom: 10,
              position: "absolute"
            }}
            ref={animation => {
              this.animation = animation;
            }}
            loop
          />
          <DateTimeModal
            visible={this.state.showDateTimeModal}
            onClose={this.toggleDateTimeModal.bind(this)}
            date={this.state.eventDate}
            time={this.state.eventTime}
            order={this.state.eventOrder}
            setTime={this.setTime.bind(this)}
          />
          <LocationModal
            setLocation={this.setLocation.bind(this)}
            visible={this.state.showLocationModal}
            onClose={this.toggleLocationModal.bind(this)}
            eventLocation={this.state.eventLocation}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ updateEventData }, dispatch);
};

const styles = {
  container: {
    flex: 1,
    height: screenHeight,
    backgroundColor: "white"
  },
  header: {
    height: screenHeight * 0.05,
    borderBottomWidth: 1.5,
    borderBottomColor: "#E7E7E7",
    justifyContent: "center"
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
  cardContainer: {
    width: screenWidth * 0.9,
    marginTop: 3,
    paddingLeft: 40,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 20
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEventModal);
