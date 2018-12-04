import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import EventCard from "../EventCard";
import Event from "../../classes/Event";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateEventInfo,
  publishEvent
} from "../../redux/actions/EventActions";
import { fetchEvents } from "../../redux/actions/EventsActions";
import { withNavigation } from "react-navigation";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let tempEvent;

class Screen3 extends Component {
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
      this.props.tempEventImage,
      this.props.eventContact,
      this.props.eventID
    );
  }

  async onPublish() {
    await this.props.publishEvent(this.props.event);
    await this.props.fetchEvents("MA", null, this.props.user);
    this.props.navigation.navigate("Explore");
  }

  makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.onPublish.bind(this)}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Publish</Text>
          </TouchableOpacity>
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
      fetchEvents: fetchEvents
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
    user: state.user
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
