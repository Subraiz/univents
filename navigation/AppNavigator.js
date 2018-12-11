import React from "react";
import { createSwitchNavigator } from "react-navigation";
import MainTabNavigator from "./MainTabNavigator";

const AppNavigator = createSwitchNavigator({
  Main: MainTabNavigator
});

export { AppNavigator };
