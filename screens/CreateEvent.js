import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  Dimensions,
  LayoutAnimation,
  UIManager,
  SafeAreaView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Screen1 from "../components/CreateEventScreens/Screen1";
import Screen2 from "../components/CreateEventScreens/Screen2";
import Screen3 from "../components/CreateEventScreens/Screen3";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearEventInfo } from "../redux/actions/EventActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let screens = ["Screen1", "Screen2", "Screen3"];

class CreateEvent extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Create An Event",
      gesturesEnabled: true,
      header: null
    };
  };

  state = {
    screen: "Screen1",
    screenIndex: 0,
    animation: "right"
  };

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  componentWillMount() {
    this.props.clearEventInfo();
  }

  renderScreen() {
    if (this.state.screen == screens[0]) {
      return (
        <Screen1
          onPress={this.onNextPress.bind(this)}
          animation={this.state.animation}
        />
      );
    } else if (this.state.screen == screens[1]) {
      return (
        <Screen3
          onPress={this.onPublishPress.bind(this)}
          onReturn={this.onReturnPress.bind(this)}
          animation={this.state.animation}
        />
      );
    }
  }

  onNextPress() {
    this.state.screenIndex = this.state.screenIndex + 1;
    this.setState({
      screen: screens[this.state.screenIndex],
      animation: "right"
    });
  }

  onReturnPress() {
    this.state.screenIndex = this.state.screenIndex - 1;
    this.setState({
      screen: screens[this.state.screenIndex],
      animation: "left"
    });
  }

  onPublishPress() {
    console.log("Publish");
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.mainHeaderContainer}
          colors={["#40E488", "#2DE85D"]}
        >
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
            onPress={() => {
              this.props.navigation.pop();
            }}
          >
            <Icon
              name={"ios-arrow-back"}
              style={{ fontSize: 24, marginRight: 15, color: "white" }}
            />
            <Text
              style={{
                fontSize: 19,
                fontFamily: "PublicSans-Regular",
                color: "white"
              }}
            >
              Create an Event
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={{ flex: 1 }}>{this.renderScreen()}</View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      clearEventInfo: clearEventInfo
    },
    dispatch
  );
};

const styles = {
  container: {
    backgroundColor: "#F7F7F7",
    flex: 1
  },
  activeTab: {
    width: screenWidth * 0.33,
    height: 5,
    backgroundColor: "red",
    marginRight: 4
  },
  inactiveTab: {
    width: screenWidth * 0.33,
    height: 5,
    backgroundColor: "lightgrey",
    marginRight: 4
  },
  tabsContainer: {
    flexDirection: "row"
  },
  mainHeaderContainer: {
    paddingLeft: 15,
    paddingTop: 60,
    paddingBottom: 10
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEvent);
