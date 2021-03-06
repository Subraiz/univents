import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
  Platform
} from "react-native";
import FavoritedEvents from "../components/FavoritedEvents";
import CreatedEvents from "../components/CreatedEvents";
import AttendedEvents from "../components/AttendedEvents";
import CreateEvent from "./CreateEvent";
import Icon from "react-native-vector-icons/Ionicons";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearEventInfo } from "../redux/actions/EventActions";
import { fetchUserEvents } from "../redux/actions/EventsActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Events extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.FirstRoute = () => (
      <FavoritedEvents favoritedEvents={this.props.favoritedEvents} />
    );
    this.SecondRoute = () => (
      <CreatedEvents createdEvents={this.props.createdEvents} />
    );
    this.ThirdRoute = () => (
      <AttendedEvents attendedEvents={this.props.attendedEvents} />
    );
  }

  state = {
    index: 0,
    routes: [
      { key: "first", title: "Favorited" },
      { key: "second", title: "Created" },
      { key: "third", title: "Attended" }
    ]
  };

  onButtonPress() {
    this.props.navigation.navigate("CreateEvent", {
      navigation: this.props.navigation
    });
  }

  componentWillUpdate() {
    this.FirstRoute = () => (
      <FavoritedEvents favoritedEvents={this.props.localFavoritedEvents} />
    );
    this.SecondRoute = () => (
      <CreatedEvents createdEvents={this.props.localCreatedEvents} />
    );
    this.ThirdRoute = () => (
      <AttendedEvents attendedEvents={this.props.attendedEvents} />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        <View style={styles.headerContainer}>
          <SafeAreaView style={{ marginLeft: screenWidth * 0.03 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: "black",
                  fontFamily: "PublicSans-Bold"
                }}
              >
                My Events
              </Text>
              <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
                <Icon
                  name="md-add"
                  style={{ fontSize: 36, color: "#92C83D" }}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: this.FirstRoute,
            second: this.SecondRoute,
            third: this.ThirdRoute
          })}
          onIndexChange={index => this.setState({ index })}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "#92C83D", height: 4 }}
              style={{ backgroundColor: "white" }}
              labelStyle={
                Platform.OS === "ios"
                  ? styles.iosLabelStyle
                  : styles.androidLabelStyle
              }
            />
          )}
          initialLayout={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    createdEvents: state.userEvents.createdEvents,
    favoritedEvents: state.userEvents.favoritedEvents,
    attendedEvents: state.userEvents.attendedEvents,
    localFavoritedEvents: state.localUserEvents.favoritedEvents,
    localCreatedEvents: state.localUserEvents.createdEvents,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      clearEventInfo: clearEventInfo,
      fetchUserEvents: fetchUserEvents
    },
    dispatch
  );
};

const styles = {
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    padding: 16
  },
  activeTabContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "red",
    paddingBottom: 3,
    marginRight: 30
  },
  inactiveTabContainer: {
    paddingBottom: 3,
    marginRight: 30
  },
  headerContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: "white",
    height: 100
  },
  iosLabelStyle: {
    color: "black",
    fontWeight: "400",
    textTransform: "capitalize",
    fontFamily: "PublicSans-Medium"
  },
  androidLabelStyle: {
    color: "black",
    fontWeight: "400",
    fontFamily: "PublicSans-Medium"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);
