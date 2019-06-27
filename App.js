import React, { Component } from "react";
import { View } from "react-native";
import codePush from "react-native-code-push";
import Root from "./Root";
import store from "./store";
import { Provider } from "react-redux";
import { AsyncStorage } from "react-native";
import firebase from "@firebase/app";
require("@firebase/auth");

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

export default codePush(codePushOptions)(App);
