import Colors from "../constants/Colors";
import React, { Component } from "react";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import {
  Text,
  View,
  TouchableOpacity,
  UIManager,
  LayoutAnimation
} from "react-native";
import icoMoonConfig from "../assets/Icons/icomoon/selection.json";
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

class TabBarIcon extends Component {
  componentDidMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  render() {
    return (
      <Icon
        size={this.props.focused ? 34 : 30}
        name={this.props.name}
        color="red"
        style={{
          color: this.props.focused
            ? Colors.tabIconSelected
            : Colors.tabIconDefault
        }}
      />
    );
  }
}

export default TabBarIcon;
