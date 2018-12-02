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
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={"explore"} />
};

const EventsScreen = createStackNavigator({
  Events: Events
});

EventsScreen.navigationOptions = {
  header: null,
  gesturesEnabled: false,
  tabBarLabel: "Events",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={"event"} />
};

const ProfileScreen = createStackNavigator({
  Profile: Profile
});

ProfileScreen.navigationOptions = {
  header: null,
  gesturesEnabled: false,
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={"people"} />
};

export default createBottomTabNavigator(
  {
    Events: { screen: EventsScreen },
    Explore: { screen: ExploreScreen },
    Profile: { screen: ProfileScreen }
  },
  {
    initialRouteName: "Explore",
    tabBarOptions: {
      activeTintColor: "red",
      inactiveTintColor: "#4D4D4D"
    }
  }
);
