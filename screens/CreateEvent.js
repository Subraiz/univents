import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";
import Screen1 from "../components/CreateEventScreens/Screen1";
import Screen2 from "../components/CreateEventScreens/Screen2";
import Screen3 from "../components/CreateEventScreens/Screen3";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let screens = ["Screen1", "Screen2", "Screen3"];

class CreateEvent extends Component {
  static navigationOptions = ({ navigation, props }) => {
    return {
      title: "Create An Event",
      gesturesEnabled: false,
      headerLeft: (
        <Button
          title="Cancel"
          onPress={() => {
            navigation.navigate("Events");
          }}
        />
      )
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
        <Screen2
          onPress={this.onNextPress.bind(this)}
          onReturn={this.onReturnPress.bind(this)}
          animation={this.state.animation}
        />
      );
    } else if (this.state.screen == screens[2]) {
      return (
        <Screen3
          onPress={this.onPublishPress.bind(this)}
          onReturn={this.onReturnPress.bind(this)}
          animation={this.state.animation}
        />
      );
    }
  }

  renderNavigationTabs() {
    if (this.state.screen == screens[0]) {
      return (
        <Animatable.View style={styles.tabsContainer}>
          <View style={styles.activeTab} />
          <View style={styles.inactiveTab} />
          <View style={styles.inactiveTab} />
        </Animatable.View>
      );
    } else if (this.state.screen == screens[1]) {
      return (
        <Animatable.View style={styles.tabsContainer}>
          <View style={styles.inactiveTab} />
          <View style={styles.activeTab} />
          <View style={styles.inactiveTab} />
        </Animatable.View>
      );
    } else if (this.state.screen == screens[2]) {
      return (
        <Animatable.View style={styles.tabsContainer}>
          <View style={styles.inactiveTab} />
          <View style={styles.inactiveTab} />
          <View style={styles.activeTab} />
        </Animatable.View>
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
        {this.renderNavigationTabs()}
        <View style={{ marginTop: 20 }}>{this.renderScreen()}</View>
      </View>
    );
  }
}

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
  }
};

export default CreateEvent;
