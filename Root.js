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
import firebase from "@firebase/app";
require("@firebase/auth");
import SplashScreen from "./screens/SplashScreen";

import Unverified from "./screens/login/Unverified";
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
import { AppNavigator } from "./navigation/AppNavigator";
import { createStackNavigator } from "react-navigation";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUser } from "./redux/actions/LoginActions";
import { fetchEvents, fetchUserEvents } from "./redux/actions/EventsActions";

let count = 0;

const LoginStack = createStackNavigator(
  {
    Login: Login,
    SignUpForm: SignUpForm,
    SignUpPersonalInfo: SignUpPersonalInfo,
    SignUpProfilePhoto: SignUpProfilePhoto,
    SignUpInterests: SignUpInterests,
    LoginForm: LoginForm
  },
  {
    initialRouteName: "Login"
  }
);

const UnverifiedStack = createStackNavigator(
  {
    Unverified: Unverified
  },
  {
    initialRouteName: "Unverified"
  }
);

const HomeStack = createStackNavigator(
  {
    CreateEvent: CreateEvent,
    EventInformation: EventInformation,
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
    verified: false,
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

    firebase.auth().onAuthStateChanged(async user => {
      if (user && count == 0) {
        console.log(user.uid);
        await this.props.getUser(user.uid);
        this.setState({ authenticated: true, verified: user.emailVerified });
        setTimeout(() => this.setState({ loading: false }), 1500);
        count++;
      } else if (!user && count == 0) {
        this.setState({ authenticated: false, verified: false });
        setTimeout(() => this.setState({ loading: false }), 1500);
        count++;
      }
    });
  };

  authenticated = (emailVerified) => {
    this.setState({ authenticated: true, verified: emailVerified });
  };

  verified = () => {
    this.setState({ authenticated: true, verified: true });
  };

  logout =() => {
    this.setState({ authenticated: false, verified: false });
  };

  render() {
    if (this.state.loading) {
      return <SplashScreen />;
    }

    if (this.state.authenticated === true && this.state.verified === true) {
      {
        this.props.fetchEvents("MA", this.props.user);
        this.props.fetchUserEvents(this.props.user);
      }
      return <HomeStack screenProps={{
        logout: this.logout
      }}/>;
    } else if (this.state.authenticated === true) {
      return <UnverifiedStack screenProps={{
        verified: this.verified,
        logout: this.logout
      }}/>
    } else {
      return <LoginStack screenProps={{
        authenticated: this.authenticated
      }}/>;
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
