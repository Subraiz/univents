import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";
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
      this.props.eventID,
      this.props.eventLinks
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
    }, 1000);
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
            width: screenWidth * 0.4,
            alignItems: "center"
          }}
        >
          <ActivityIndicator size="small" color="#a7a7a7" />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.publishButtonStyle}
          onPress={this.onPublish.bind(this)}
        >
          <Text
            style={{
              color: "black",
              fontSize: 16,
              fontFamily: "PublicSans-Regular"
            }}
          >
            Publish
          </Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    let animation =
      this.props.animation == "right" ? "slideInRight" : "slideInLeft";
    return (
      <Animatable.View
        animation={animation}
        duration={300}
        style={{ marginTop: 20 }}
      >
        <View style={{ width: screenWidth, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 19,
              fontFamily: "PublicSans-Bold",
              marginBottom: 10
            }}
          >
            Event Preview
          </Text>
          <View
            style={{
              backgroundColor: "white",
              width: screenWidth,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 15
            }}
          >
            <EventCard event={tempEvent} />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 30,
            paddingHorizontal: 10
          }}
        >
          <TouchableOpacity
            style={styles.returnButtonStyle}
            onPress={this.props.onReturn}
          >
            <Text
              style={{
                color: "black",
                fontSize: 16,
                fontFamily: "PublicSans-Regular"
              }}
            >
              Edit Event
            </Text>
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
    tempEventImage,
    eventLinks
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
    eventLinks,
    uid: state.user.uid,
    tempEventImage,
    user: state.user,
    localCreatedEvents: state.localUserEvents.createdEvents
  };
};

const styles = {
  returnButtonStyle: {
    alignSelf: "center",
    width: screenWidth * 0.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    shadowColor: "black",
    shadowOffset: { width: 3, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.08,
    borderWidth: 0.15,
    borderTopWidth: 2,
    borderTopColor: "#00AEEF"
  },
  publishButtonStyle: {
    alignSelf: "center",
    width: screenWidth * 0.4,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    shadowColor: "black",
    shadowOffset: { width: -3, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.08,
    borderWidth: 0.15,
    borderTopWidth: 2,
    borderTopColor: "#40E488"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Screen3));
