import React from "react";
import { Icon } from "react-native-elements";

import Colors from "../constants/Colors";

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon
        name={this.props.name}
        size={27 || this.props.size}
        color={
          this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
        }
        containerStyle={{ marginTop: 0 }}
        type={this.props.type || "material"}
      />
    );
  }
}
