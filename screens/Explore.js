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
  BackHandler
} from "react-native";
import { SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchEvents } from "../redux/actions/EventsActions";
import Deck from "../components/Deck";
import Map from "../components/Map";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let count = 0;

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

    if (count == 0) {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
      LayoutAnimation.easeInEaseOut();
      count++;
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <SearchBar
          containerStyle={styles.searchBar}
          round
          lightTheme
          showLoading
          searchIcon={{ size: 24 }}
          placeholder="Search For an Event..."
        />
        <Map navigation={this.props.navigation} events={this.props.allEvents} />
        <Deck navigation={this.props.navigation} events={this.props.events} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
    allEvents: state.events.allEvents
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

const styles = {
  container: {
    height: screenHeight,
    backgroundColor: "#FFFFFF"
  },
  searchBar: {
    backgroundColor: "rgba(0,0,0,0)",
    borderTopColor: "rgba(0,0,0,0)"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explore);
