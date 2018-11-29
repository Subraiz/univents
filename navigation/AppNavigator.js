import React from "react";
import { createSwitchNavigator } from "react-navigation";
import ProfileTabNavigator from "./ProfileTabNavigator";
import MainTabNavigator from "./MainTabNavigator";

const AppNavigator = createSwitchNavigator({
  Main: MainTabNavigator
});

const ProfileNavigator = createSwitchNavigator({
  ProfileNavigator: ProfileTabNavigator
});

export { AppNavigator, ProfileNavigator };
