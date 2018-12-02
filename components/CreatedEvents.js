import React, { Component } from "react";
import { Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

class CreatedEvents extends Component {
  render() {
    return (
      <Animatable.View animation="bounceIn" style={styles.container}>
        <Text>Created Events</Text>
      </Animatable.View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "blue"
  }
};

export default CreatedEvents;
