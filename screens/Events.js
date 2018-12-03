import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions
} from "react-native";
import SavedEvents from "../components/SavedEvents";
import CreatedEvents from "../components/CreatedEvents";
import CreateEvent from "./CreateEvent";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Events extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  state = {
    screen: "Saved"
  };

  onButtonPress() {
    this.props.navigation.navigate("CreateEvent", {
      navigation: this.props.navigation
    });
  }

  renderScreen() {
    if (this.state.screen == "Saved") {
      return <SavedEvents />;
    } else {
      return <CreatedEvents />;
    }
  }

  renderTabs() {
    if (this.state.screen == "Saved") {
      return (
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ screen: "Saved" });
            }}
            style={styles.activeTabContainer}
          >
            <Text>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ screen: "Created" });
            }}
            style={styles.inactiveTabContainer}
          >
            <Text>Created</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ screen: "Saved" });
            }}
            style={styles.inactiveTabContainer}
          >
            <Text>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ screen: "Created" });
            }}
            style={styles.activeTabContainer}
          >
            <Text>Created</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <View>
        <View style={styles.headerContainer}>
          <SafeAreaView style={{ marginLeft: screenWidth * 0.03 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 24, color: "black", fontWeight: "600" }}>
                My Events
              </Text>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={this.onButtonPress.bind(this)}
              >
                <Text style={{ color: "white", fontSize: 34 }}>+</Text>
              </TouchableOpacity>
            </View>
            {this.renderTabs()}
          </SafeAreaView>
        </View>
        {this.renderScreen()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
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
  buttonStyle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#05B7EC",
    position: "absolute",
    marginLeft: screenWidth * 0.75,
    alignItems: "center"
  },
  headerContainer: { paddingTop: 10, paddingLeft: 10, backgroundColor: "white" }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);
