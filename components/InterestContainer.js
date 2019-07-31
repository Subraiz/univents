import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  UIManager,
  LayoutAnimation
} from "react-native";
import { Icon } from "react-native-elements";

class InterestContainer extends Component {
  // state = {
  //   selected: false
  // };

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  render() {
    if (!this.props.interest.selected) {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={this.props.onPress}>
          <View
            style={{
              backgroundColor: this.props.colors.mainColor || "orange",
              margin: 10,
              alignSelf: "flex-start",
              borderRadius: 8
            }}
          >
            <Text
              style={{
                fontSize: 14,
                paddingVertical: 5,
                paddingHorizontal: 10,
                color: "white"
              }}
            >
              {this.props.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity activeOpacity={0.7} onPress={this.props.onPress}>
          <View
            style={{
              backgroundColor: this.props.colors.secondaryColor || "orange",
              alignSelf: "flex-start",
              borderRadius: 8,
              margin: 10,
              flexDirection: "row",
              borderWidth: 1,
              borderColor: this.props.colors.mainColor
            }}
          >
            <View style={{ paddingLeft: 10, flexDirection: "row" }}>
              <Icon
                name="check-circle"
                color={this.props.colors.mainColor}
                size={14}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: this.props.colors.mainColor,
                  paddingVertical: 5,
                  paddingHorizontal: 10
                }}
              >
                {this.props.title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

export default InterestContainer;
