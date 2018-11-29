import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  UIManager,
  LayoutAnimation,
  Easing,
  Animated
} from "react-native";
import { Provider } from "react-redux";
import store from "./store";
import firebase from "@firebase/app";
require("@firebase/auth");

import Login from "./screens/login/Login";
import SignUpForm from "./screens/login/SignUpForm";
import SignUpPersonalInfo from "./screens/login/SignUpPersonalInfo";
import SignUpProfilePhoto from "./screens/login/SignUpProfilePhoto";
import LoginForm from "./screens/login/LoginForm";
import SignUpInterests from "./screens/login/SignUpInterests";
import Explore from "./screens/Explore";
import Events from "./screens/Events";
import Profile from "./screens/Profile";
import EventInformation from "./screens/EventInformation";
import EventCardsRow from "./components/EventCardsRow";
import AdminTools from "./components/AdminTools";
import { AppNavigator, ProfileNavigator } from "./navigation/AppNavigator";
import { createStackNavigator } from "react-navigation";

let count = 0;

const LoginStack = createStackNavigator(
  {
    Login: Login,
    SignUpForm: SignUpForm,
    SignUpPersonalInfo: SignUpPersonalInfo,
    SignUpProfilePhoto: SignUpProfilePhoto,
    SignUpInterests: SignUpInterests,
    LoginForm: LoginForm,
    EventInformation: EventInformation,
    EventCardsRow: EventCardsRow,
    AdminTools: AdminTools,
    AppNavigator: {
      screen: AppNavigator,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    ProfileNavigator: ProfileNavigator
  },
  {
    initialRouteName: "Login"
  }
);

const HomeStack = createStackNavigator(
  {
    Login: Login,
    SignUpForm: SignUpForm,
    SignUpPersonalInfo: SignUpPersonalInfo,
    SignUpProfilePhoto: SignUpProfilePhoto,
    SignUpInterests: SignUpInterests,
    LoginForm: LoginForm,
    EventInformation: EventInformation,
    EventCardsRow: EventCardsRow,
    AdminTools: AdminTools,
    AppNavigator: {
      screen: AppNavigator,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    ProfileNavigator: ProfileNavigator
  },
  {
    initialRouteName: "AppNavigator"
  }
);

export default class App extends React.Component {
  state = {
    authenticated: false,
    loading: true
  };

  componentWillUpdate() {}

  componentWillMount = async () => {
    var config = {
      apiKey: "AIzaSyAAeuyg8vOKzrFOkS-oeNBTGvSTiWz-y2E",
      authDomain: "univents-a5f76.firebaseapp.com",
      databaseURL: "https://univents-a5f76.firebaseio.com",
      projectId: "univents-a5f76",
      storageBucket: "univents-a5f76.appspot.com",
      messagingSenderId: "106554497811"
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged(user => {
      if (user && count == 0) {
        this.setState({ loading: false, authenticated: true });
        count++;
      } else if (!user && count == 0) {
        this.setState({ loading: false, authenticated: false });
        count++;
      }
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <SafeAreaView>
          <Text>Splash Screen</Text>
        </SafeAreaView>
      );
    }

    if (this.state.authenticated) {
      {
        console.log("loading");
      }
      return (
        <Provider store={store}>
          <HomeStack />
        </Provider>
      );
    } else {
      {
        console.log("loading");
      }
      return (
        <Provider store={store}>
          <LoginStack />
        </Provider>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: "50%",
    width: "100%"
  }
});
