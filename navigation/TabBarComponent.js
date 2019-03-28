import TabBar from "./TabBar";
import React, { Component } from "React";
import Icon from "react-native-vector-icons/Ionicons";
import { View, TouchableHighlight } from "react-native";

class TabBarComponent extends Component {
  render() {
    const { navigation } = this.props;
    const { routes } = navigation.state;

    return (
      <TabBar routes={routes} navigation={navigation}>
        <TabBar.Item
          icon={require("./tab1Disabled.png")}
          selectedIcon={require("./tab1.png")}
          title="Tab1"
        >
          <View>{/*Page Content*/}</View>
        </TabBar.Item>
        <TabBar.Item
          icon={require("./tab2Disabled.png")}
          selectedIcon={require("./tab2.png")}
          title="Tab2"
        >
          <View>{/*Page Content*/}</View>
        </TabBar.Item>
        <TabBar.Item
          icon={require("./tab3Disabled.png")}
          selectedIcon={require("./tab3.png")}
          title="Tab3"
        >
          <View>{/*Page Content*/}</View>
        </TabBar.Item>
      </TabBar>
    );
  }
}

export default TabBarComponent;
