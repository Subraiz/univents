import React, { Component } from "react";
import { Text, View } from "react-native";
import { Provider } from "react-redux";
import store from "./store";
import Root from "./Root";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
