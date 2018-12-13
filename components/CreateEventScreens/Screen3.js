import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import EventCard from "../EventCard";
import Event from "../../classes/Event";
import LottieView from "lottie-react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateEventInfo,
  publishEvent
} from "../../redux/actions/EventActions";
import {
  fetchEvents,
  fetchUserEvents,
  storeLocalEvents
} from "../../redux/actions/EventsActions";
import { withNavigation } from "react-navigation";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let tempEvent;

class Screen3 extends Component {
  state = {
    uploading: false
  };

  componentWillMount() {
    let randomString = this.makeid();
    let eventID = `${this.props.uid}${randomString}`;
    this.props.updateEventInfo({ prop: "eventID", value: eventID });
    tempEvent = new Event(
      this.props.eventName,
      this.props.eventDescription,
      this.props.eventDate,
      this.props.eventHost,
      this.props.eventCategories,
      this.props.eventCoordinates,
      this.props.eventLocation,
      this.props.eventTime,
      this.props.eventType,
      this.props.eventImage,
      this.props.eventContact,
      this.props.eventID
    );
  }

  async onPublish() {
    this.props.localCreatedEvents.unshift(this.props.event);
    await this.props.publishEvent(this.props.event, "MA");
    await this.props.fetchEvents("MA", this.props.user);
    this.props.storeLocalEvents(this.props.localCreatedEvents, "createdEvents");

    setTimeout(() => {
      if (!this.props.event.uploading) {
        this.props.navigation.navigate("Explore");
      }
    }, 2000);
  }

  makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  renderPublishButton() {
    if (this.props.event.uploading) {
      return (
        <View
          style={{
            alignSelf: "center",

            alignItems: "center"
          }}
        >
          <LottieView
            style={{ width: 100, height: 100 }}
            autoPlay
            loop
            source={require("../../assets/animations/loading.json")}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={this.onPublish.bind(this)}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Publish</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    let animation =
      this.props.animation == "right" ? "slideInRight" : "slideInLeft";
    return (
      <Animatable.View animation={animation} duration={300}>
        <View style={{ width: screenWidth, alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
            Event Preview
          </Text>
          <EventCard event={tempEvent} />
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
          {this.renderPublishButton()}
        </View>
      </Animatable.View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateEventInfo: updateEventInfo,
      publishEvent: publishEvent,
      fetchEvents: fetchEvents,
      fetchUserEvents: fetchUserEvents,
      storeLocalEvents: storeLocalEvents
    },
    dispatch
  );
};

const mapStateToProps = state => {
  let {
    eventName,
    eventDescription,
    eventDate,
    eventHost,
    eventCategories,
    eventCoordinates,
    eventLocation,
    eventTime,
    eventType,
    eventImage,
    eventContact,
    eventID,
    tempEventImage
  } = state.event;
  return {
    event: state.event,
    eventName,
    eventDescription,
    eventDate,
    eventHost,
    eventCategories,
    eventCoordinates,
    eventLocation,
    eventTime,
    eventType,
    eventImage,
    eventContact,
    eventID,
    uid: state.user.uid,
    tempEventImage,
    user: state.user,
    localCreatedEvents: state.localUserEvents.createdEvents
  };
};

const styles = {
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
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Screen3));
