import React, { Component } from "react";
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Screen2 extends Component {
  render() {
    let animation =
      this.props.animation == "right" ? "slideInRight" : "slideInLeft";
    return (
      <Animatable.View animation={animation} duration={400}>
        <View style={styles.cardContainer}>
          <View style={styles.categoryContainer}>
            <Text>Category</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text>Event Description</Text>
          </View>
        </View>

        <View style={styles.secondContaienr}>
          <View style={styles.imageContainer}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="add" color={"grey"} />
              <Text style={{ marginTop: 5, color: "grey" }}>
                Upload From Photos
              </Text>
            </View>
          </View>
          <View style={styles.instructionsContainer}>
            <Text
              style={{
                marginBottom: 4,
                color: "grey",
                fontStyle: "italic",
                fontSize: 16,
                fontWeight: "500"
              }}
            >
              Upload Photo
            </Text>
            <Text style={{ marginBottom: 4, color: "grey" }}>
              Recommended Size
            </Text>
            <Text style={{ marginBottom: 4, color: "grey" }}>375 x 135 px</Text>
          </View>
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
            onPress={this.props.onPress}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Next</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  }
}

const styles = {
  cardContainer: {
    alignItems: "center",
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "black",
    shadowRadius: 4,
    shadowOpacity: 0.6
  },
  categoryContainer: {
    width: screenWidth * 0.95,
    paddingLeft: 40,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  infoContainer: {
    width: screenWidth * 0.95,
    paddingTop: 10,
    height: screenHeight * 0.3,
    backgroundColor: "white",
    paddingLeft: 10
  },
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
  },
  imageContainer: {
    width: 150,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey"
  },
  secondContaienr: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    width: screenWidth * 0.95,
    alignSelf: "center",
    marginTop: 20,
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "black",
    shadowRadius: 4,
    shadowOpacity: 0.6
  },
  instructionsContainer: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: screenWidth * 0.07
  }
};

export default Screen2;
