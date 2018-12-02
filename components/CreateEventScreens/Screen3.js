import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";

class Screen3 extends Component {
  render() {
    let animation =
      this.props.animation == "right" ? "slideInRight" : "slideInLeft";
    return (
      <Animatable.View animation={animation} duration={300}>
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
            onPress={this.props.onPress}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Publish</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  }
}

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

export default Screen3;
