import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  StatusBar,
  Dimensions,
  UIManager,
  LayoutAnimation,
  BackHandler,
  StyleSheet
} from "react-native";
import { SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchEvents } from "../redux/actions/EventsActions";
import DummyData from "../constants/DummyData";
import Deck from "../components/Deck";
import Map from "../components/Map";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Explore extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  handleBackPress() {
    return true;
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer} />
        <Map
          navigation={this.props.navigation}
          events={this.props.todaysEvents}
        />
        <Deck navigation={this.props.navigation} events={this.props.events} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
    todaysEvents: state.events.todaysEvents
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchEvents: fetchEvents
    },
    dispatch
  );
};

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    backgroundColor: "#FFFFFF"
  },
  headerContainer: {
    width: screenWidth,
    height: screenHeight * 0.03,
    backgroundColor: "white"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explore);
