import React, { Component } from "react";
import { Platform, UIManager, LayoutAnimation, Dimensions } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createTabNavigator
} from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";
import Explore from "../screens/Explore";
import Events from "../screens/Events";
import Profile from "../screens/Profile";
import EventInformation from "../components/EventInformation";
import BottomNavigation, {
  IconTab,
  Badge
} from "react-native-material-bottom-navigation";

let regularSize = 25;
let selectedSize = 27;

const screenHeight = Dimensions.get("window").height;

// const EventInformationScreen = createStackNavigator({
//   EventInformation: EventInformation
// });
//
// EventInformation.navigationOptions = {
//   header: null,
//   gesturesEnabled: false,
//   tabBarLabel: "Event Infromation",
//   tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={"explore"} />
// };

const ExploreScreen = createStackNavigator({
  Explore: Explore
});

ExploreScreen.navigationOptions = {
  header: null,
  gesturesEnabled: false,
  tabBarLabel: "Explore",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"ios-send"} />
  )
};

const EventsScreen = createStackNavigator({
  Events: Events
});

EventsScreen.navigationOptions = {
  header: null,
  gesturesEnabled: false,
  tabBarLabel: "Events",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"ios-calendar"} />
  )
};

const ProfileScreen = createStackNavigator({
  Profile: Profile
});

ProfileScreen.navigationOptions = {
  header: null,
  gesturesEnabled: false,
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"md-contact"} />
  )
};

const TabNavigator = createBottomTabNavigator(
  {
    Events: { screen: EventsScreen },
    Explore: { screen: ExploreScreen },
    Profile: { screen: ProfileScreen }
  },
  {
    initialRouteName: "Explore",
    tabBarOptions: {
      activeTintColor: "red",
      inactiveTintColor: "#4D4D4D",
      style: { paddingTop: 4, backgroundColor: "#F7F7F7" },
      labelStyle: { fontWeight: "600" }
    },
    order: ["Events", "Explore", "Profile"]
  }
);

export default TabNavigator;
