import React, { Component } from "react";
import { Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

class SavedEvents extends Component {
  render() {
    return (
      <Animatable.View animation="bounceIn" style={styles.container}>
        <Text>Saved Events</Text>
      </Animatable.View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "yellow"
  }
};

export default SavedEvents;
