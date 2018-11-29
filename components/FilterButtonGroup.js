import React, { Component } from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { Icon } from "react-native-elements";

class FilterButtonGroup extends Component {
  render() {
    return (
      <View style={styles.buttonGroupContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.props.onPress}
            style={[styles.buttonStyle, { backgroundColor: "#00B01F" }]}
          >
            <View style={styles.iconContainerStyle}>
              <Icon name="whatshot" color="white" size={38} />
            </View>
          </TouchableOpacity>
          <Text style={styles.buttonTitleStyle}>Social</Text>
        </View>

        <View
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={this.props.onPress}
        >
          <TouchableOpacity
            style={[styles.buttonStyle, { backgroundColor: "#104976" }]}
            activeOpacity={0.7}
            onPress={this.props.onPress}
          >
            <View style={styles.iconContainerStyle}>
              <Icon name="mic" color="white" size={38} />
            </View>
          </TouchableOpacity>
          <Text style={styles.buttonTitleStyle}>Speaker</Text>
        </View>

        <View
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={this.props.onPress}
        >
          <TouchableOpacity
            style={[styles.buttonStyle, { backgroundColor: "#DE3E26" }]}
            activeOpacity={0.7}
            onPress={this.props.onPress}
          >
            <View style={styles.iconContainerStyle}>
              <Icon name="backup" color="white" size={33} />
            </View>
          </TouchableOpacity>
          <Text style={styles.buttonTitleStyle}>Tech</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonStyle, { backgroundColor: "#B1B1B1" }]}
            activeOpacity={0.7}
            onPress={this.props.onPress}
          >
            <View style={styles.iconContainerStyle}>
              <Icon name="queue" color="white" size={32} />
            </View>
          </TouchableOpacity>
          <Text style={styles.buttonTitleStyle}>More</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  buttonGroupContainer: {
    marginTop: 12,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    marginRight: 17
  },
  buttonStyle: {
    width: 47,
    height: 47,
    borderRadius: 47,
    backgroundColor: "blue",
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "black",
    shadowRadius: 2,
    shadowOpacity: 0.5
  },
  buttonTitleStyle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "200",
    color: "black",
    textAlign: "center"
  },
  iconContainerStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 47,
    justifyContent: "center",
    alignItems: "center"
  }
};

export default FilterButtonGroup;
