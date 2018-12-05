import React, { Component } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import EventCard from "./EventCard";
import { withNavigation } from "react-navigation";
import * as Animatable from "react-native-animatable";

class CreatedEvents extends Component {
  componentWillMount() {
    console.log(this.props.createdEvents);
  }

  onEventPress(event) {
    this.props.navigation.navigate("EventInformation", {
      data: event,
      navigation: this.props.navigation
    });
  }

  renderEvents() {
    return this.props.createdEvents.map(event => {
      return (
        <TouchableOpacity
          key={event.eventID + "1"}
          activeOpacity={0.8}
          onPress={this.onEventPress.bind(this, event)}
        >
          <EventCard event={event} key={event.eventID} />
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <Animatable.View animation="bounceIn">
        <ScrollView>
          <View style={styles.eventsContainer}>{this.renderEvents()}</View>
        </ScrollView>
      </Animatable.View>
    );
  }
}

const styles = {
  eventsContainer: {
    marginTop: 5
  }
};

export default withNavigation(CreatedEvents);
