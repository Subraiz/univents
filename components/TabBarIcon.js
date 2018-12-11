import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

import Colors from "../constants/Colors";

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon
        name={this.props.name}
        style={{
          fontSize: 30 || this.props.size,
          color: this.props.focused
            ? Colors.tabIconSelected
            : Colors.tabIconDefault
        }}
      />
    );
  }
}
