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
    let delay = 0;

    return this.props.createdEvents.map(event => {
      delay += 100;
      return (
        <Animatable.View
          animation="fadeInRight"
          duration={500}
          delay={delay}
          key={event.eventID + "2"}
        >
          <TouchableOpacity
            key={event.eventID + "1"}
            activeOpacity={0.8}
            onPress={this.onEventPress.bind(this, event)}
            style={{ marginTop: 5 }}
          >
            <EventCard event={event} key={event.eventID} />
          </TouchableOpacity>
        </Animatable.View>
      );
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.eventsContainer}>{this.renderEvents()}</View>
      </ScrollView>
    );
  }
}

const styles = {
  eventsContainer: {
    marginTop: 8,
    marginBottom: 8
  }
};

export default withNavigation(CreatedEvents);
