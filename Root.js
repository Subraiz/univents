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
  Animated,
  BackHandler
} from "react-native";
import SplashScreen from "./screens/SplashScreen";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchEvents, getUserEvents } from "./redux/actions/EventsActions";
import { fetchUser, clearUser } from "./redux/actions/LoginActions";
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
import EventInformation from "./components/EventInformation";
import CreateEvent from "./screens/CreateEvent";
import EventCardsRow from "./components/EventCardsRow";
import AdminTools from "./components/AdminTools";
import { AppNavigator, ProfileNavigator } from "./navigation/AppNavigator";
import { createStackNavigator } from "react-navigation";

let count = 0;

const LoginStack = createStackNavigator(
  {
    Login: Login,
    CreateEvent: CreateEvent,
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
    CreateEvent: CreateEvent,
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

class Root extends React.Component {
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

    firebase.firestore().settings({ timestampsInSnapshots: true });

    firebase.auth().onAuthStateChanged(async user => {
      if (user && count == 0) {
        this.setState({ authenticated: true });
        await this.props.fetchUser(this.props.user.uid);
        await this.props.fetchEvents("MA", null, this.props.user);
        await this.props.getUserEvents(this.props.user.uid);
        setTimeout(() => this.setState({ loading: false }), 200);
        count++;
      } else if (!user && count == 0) {
        this.setState({ authenticated: false });
        await this.props.clearUser();
        this.setState({ loading: false });
        count++;
      }
    });
  };

  render() {
    if (this.state.loading) {
      return <SplashScreen />;
    }

    if (this.state.authenticated) {
      return <HomeStack />;
    } else {
      return <LoginStack />;
    }
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchEvents: fetchEvents,
      fetchUser: fetchUser,
      clearUser: clearUser,
      getUserEvents: getUserEvents
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    events: state.events,
    user: state.user
  };
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
