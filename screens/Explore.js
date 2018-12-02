import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  StatusBar,
  Dimensions,
  UIManager,
  LayoutAnimation
} from "react-native";
import { SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signOutUser } from "../redux/actions/SettingsActions";
import Deck from "../components/Deck";
import Map from "../components/Map";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Explore extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  componentWillMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
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
        <Map navigation={this.props.navigation} />
        <Deck navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signOutUser: signOutUser
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
