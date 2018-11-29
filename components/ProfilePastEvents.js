import React, { Component } from "react";
import { Text, View } from "react-native";

class ProfilePastEvents extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Past Events Screen</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "white"
  }
};

export default ProfilePastEvents;
