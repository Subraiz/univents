import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert
} from "react-native";
import * as Animatable from "react-native-animatable";
import DateTimeModal from "./DateTimeModal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventInfo } from "../../redux/actions/EventActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const CardSection = props => {
  return <View style={styles.cardContainer}>{props.children}</View>;
};

class Screen1 extends Component {
  state = {
    switchValue: true,
    showDateTimeModal: false
  };

  onSwitchValueChange() {
    this.setState({ switchValue: !this.state.switchValue });
    if (!this.state.switchValue) {
      this.props.updateEventInfo({ prop: "eventType", value: "Public" });
    } else {
      this.props.updateEventInfo({ prop: "eventType", value: "School" });
    }
  }

  onChangeText(text) {
    this.props.updateEventInfo({
      prop: "eventName",
      value: text.nativeEvent.text
    });
  }

  renderDateTime() {
    if (
      this.props.eventDate.month == "" &&
      this.props.eventTime.startTime == ""
    ) {
      return (
        <TouchableOpacity onPress={this.onShowDateTimeModal.bind(this)}>
          <Text style={{ color: "blue" }}>Date/Time</Text>
        </TouchableOpacity>
      );
    } else {
      let dateString = `${this.props.eventDate.month} ${
        this.props.eventDate.day
      }, ${this.props.eventDate.year}`;
      let timeString =
        "Start Time - End Time" ||
        `${this.props.eventTime.startTime} - ${this.props.eventTime.endTime}`;
      return (
        <TouchableOpacity onPress={this.onShowDateTimeModal.bind(this)}>
          <Text style={{ color: "black" }}>{dateString}</Text>
          <Text style={{ color: "black", marginTop: 4 }}>{timeString}</Text>
        </TouchableOpacity>
      );
    }
  }

  renderLocationAddress() {
    if (this.props.eventLocation.locationAddress == "") {
      return (
        <TouchableOpacity>
          <Text style={{ color: "blue" }}>Location Address</Text>
        </TouchableOpacity>
      );
    }
  }

  onLocationNameChange(text) {
    let eventLocation = {
      locationAddress: this.props.eventLocation.locationAddress,
      locationName: text.nativeEvent.text
    };

    this.props.updateEventInfo({ prop: "eventLocation", value: eventLocation });
  }

  onShowDateTimeModal() {
    this.setState({ showDateTimeModal: true });
  }

  onCloseDateTimeModal() {
    this.setState({ showDateTimeModal: false });
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
    if (
      this.props.eventName !== "" &&
      this.props.eventHost !== "" &&
      this.props.eventContact !== "" &&
      this.props.eventLocation.locationName !== "" &&
      this.props.eventLocation.locationAddress !== "" &&
      this.props.eventDate.month !== ""
    ) {
      this.props.onPress();
    } else {
      this.onButtonPress();
    }
  }

  render() {
    let animation =
      this.props.animation == "right" ? "slideInRight" : "slideInLeft";
    return (
      <Animatable.View animation={animation} duration={300}>
        <View style={{ alignItems: "center" }}>
          <CardSection>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text>{this.props.eventType}</Text>
              <Switch
                value={this.state.switchValue}
                onValueChange={this.onSwitchValueChange.bind(this)}
              />
            </View>
          </CardSection>
          <CardSection>
            <TextInput
              placeholder="Event Name"
              value={this.props.eventName}
              onChange={this.onChangeText.bind(this)}
            />
          </CardSection>
          <CardSection>
            <TextInput
              value={this.props.eventLocation.locationName}
              placeholder="Location Name (ex: Vandy Cabaret Hall)"
              onChange={this.onLocationNameChange.bind(this)}
              spellCheck={false}
            />
          </CardSection>
          <CardSection>{this.renderLocationAddress()}</CardSection>
          <CardSection>{this.renderDateTime()}</CardSection>
          <CardSection>
            <TextInput
              placeholder="Host Name"
              value={this.props.eventHost}
              spellCheck={false}
              onChange={text =>
                this.props.updateEventInfo({
                  prop: "eventHost",
                  value: text.nativeEvent.text
                })
              }
            />
          </CardSection>
          <CardSection>
            <TextInput
              placeholder="Contact Info (Email or Phone Number)"
              value={this.props.eventContact}
              spellCheck={false}
              onChange={text =>
                this.props.updateEventInfo({
                  prop: "eventContact",
                  value: text.nativeEvent.text
                })
              }
            />
          </CardSection>
        </View>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={this.renderButtonFunction.bind(this)}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Next</Text>
        </TouchableOpacity>
        <DateTimeModal
          visible={this.state.showDateTimeModal}
          onClose={this.onCloseDateTimeModal.bind(this)}
        />
      </Animatable.View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ updateEventInfo: updateEventInfo }, dispatch);
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
    eventContact
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
    eventContact: eventContact
  };
};

const styles = {
  cardContainer: {
    width: screenWidth * 0.9,
    backgroundColor: "white",
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
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen1);
