import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  UIManager,
  LayoutAnimation,
  Easing,
  Animated,
  BackHandler,
  StatusBar
} from "react-native";
import firebase_rn from "@firebase/app";
require("@firebase/auth");
import { AsyncStorage } from "react-native";
import firebase from "react-native-firebase";
import SplashScreen from "./screens/SplashScreen";

import Login from "./screens/login/Login";
import SelectSchool from "./screens/login/SelectSchool";
import SignUpForm from "./screens/login/SignUpForm";
import SignUpPersonalInfo from "./screens/login/SignUpPersonalInfo";
import SignUpProfilePhoto from "./screens/login/SignUpProfilePhoto";
import LoginForm from "./screens/login/LoginForm";
import SignUpInterests from "./screens/login/SignUpInterests";
import Explore from "./screens/Explore";
import Events from "./screens/Events";
import Profile from "./screens/Profile";
import EventInformation from "./components/EventInformation";
import CreateEvent from "./screens/CreateEvent";
import EventCardsRow from "./components/EventCardsRow";
import AdminTools from "./components/AdminTools";
import { AppNavigator } from "./navigation/AppNavigator";
import { createStackNavigator } from "react-navigation";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUser } from "./redux/actions/LoginActions";
import {
  fetchEvents,
  fetchUserEvents,
  getSpecialEvent
} from "./redux/actions/EventsActions";
import { getCategories } from "./redux/actions/SettingsActions";

let count = 0;

const LoginStack = createStackNavigator(
  {
    Login: Login,
    CreateEvent: CreateEvent,
    SelectSchool: SelectSchool,
    SignUpForm: SignUpForm,
    SignUpPersonalInfo: SignUpPersonalInfo,
    SignUpProfilePhoto: SignUpProfilePhoto,
    SignUpInterests: SignUpInterests,
    LoginForm: LoginForm,
    EventInformation: EventInformation,
    EventCardsRow: EventCardsRow,
    AdminTools: AdminTools,
    Events: Events,
    AppNavigator: {
      screen: AppNavigator,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: "Login"
  }
);

const HomeStack = createStackNavigator(
  {
    Login: Login,
    CreateEvent: CreateEvent,
    SelectSchool: SelectSchool,
    SignUpForm: SignUpForm,
    SignUpPersonalInfo: SignUpPersonalInfo,
    SignUpProfilePhoto: SignUpProfilePhoto,
    SignUpInterests: SignUpInterests,
    EventInformation: EventInformation,
    LoginForm: LoginForm,
    EventCardsRow: EventCardsRow,
    AdminTools: AdminTools,
    AppNavigator: {
      screen: AppNavigator,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: "AppNavigator"
  }
);

class Root extends React.Component {
  state = {
    authenticated: false,
    loading: true
  };

  componentWillUpdate() {}

  componentDidMount = async () => {
    StatusBar.setBarStyle("dark-content", true);
    var config = {
      apiKey: "AIzaSyAAeuyg8vOKzrFOkS-oeNBTGvSTiWz-y2E",
      authDomain: "univents-a5f76.firebaseapp.com",
      databaseURL: "https://univents-a5f76.firebaseio.com",
      projectId: "univents-a5f76",
      storageBucket: "univents-a5f76.appspot.com",
      messagingSenderId: "106554497811"
    };
    firebase_rn.initializeApp(config);

    this.checkPermission();

    this.props.getCategories();
    this.props.getSpecialEvent();

    firebase_rn.auth().onAuthStateChanged(async user => {
      if (user && count == 0) {
        await this.props.getUser(user.uid);
        this.setState({ authenticated: true });
        setTimeout(() => this.setState({ loading: false }), 1500);
        count++;
      } else if (!user && count == 0) {
        this.setState({ authenticated: false });
        setTimeout(() => this.setState({ loading: false }), 1500);
        count++;
      }
    });
  };

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  render() {
    if (this.state.loading) {
      return <SplashScreen />;
    }

    if (this.state.authenticated) {
      {
        this.props.fetchEvents("MA", this.props.user);
        this.props.fetchUserEvents(this.props.user);
      }
      return <HomeStack />;
    } else {
      return <LoginStack />;
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUser: getUser,
      fetchEvents: fetchEvents,
      fetchUserEvents: fetchUserEvents,
      getCategories: getCategories,
      getSpecialEvent: getSpecialEvent
    },
    dispatch
  );
};

const styles = StyleSheet.create({
  container: {
    height: "50%",
    width: "100%"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
