import React, { Component } from "react";
import { Platform, UIManager, LayoutAnimation, Dimensions } from "react-native";
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator
} from "react-navigation";

import ProfilePastEvents from "../components/ProfilePastEvents";
import ProfileAccountSettings from "../components/ProfileAccountSettings";

const AccountSettings = createStackNavigator({
  AccountSettings: ProfileAccountSettings
});

AccountSettings.navigationOptions = {
  header: null,
  gesturesEnabled: false,
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={"people"} />
};

const PastEvents = createStackNavigator({
  PastEvents: ProfilePastEvents
});

PastEvents.navigationOptions = {
  header: null,
  gesturesEnabled: false,
  tabBarLabel: "Past Events",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={"people"} />
};

const ProfileTabNavigator = createMaterialTopTabNavigator(
  {
    PastEvents: { screen: PastEvents },
    AccountSettings: { screen: AccountSettings }
  },
  {
    initialRouteName: "PastEvents",
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#000C7A",
      inactiveTintColor: "grey",
      indicatorStyle: { backgroundColor: "black" },
      style: {
        backgroundColor: "#F7F7F7"
      },
      tabStyle: { backgroundColor: "#F7F7F7" }
    }
  }
);

export default ProfileTabNavigator;
