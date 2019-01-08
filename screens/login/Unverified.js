import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  Platform
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  refreshEmailVerified,
} from "../../redux/actions/SettingsActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height + (Platform.OS === 'android' ? 25 : 0);

class Unverified extends Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.intervalId = setInterval(this.refreshTimer, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  refreshTimer = () => {
    this.props.refreshEmailVerified((emailVerified) => {
      if (emailVerified === true) {
        this.props.screenProps.verified();
      }
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerLogoContainer}>
          <Text style={styles.headerStyle}>UNIVENTS</Text>
        </View>
        <View style={styles.verifyTextContainer}>
          <Text style={styles.verifyTextStyle}>Please verify your email before continuing.</Text>
        </View>
        <View style={styles.buttonsViewContainer}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={this.props.screenProps.logout.bind(this)}>
              <View
                style={{
                  width: screenWidth * 0.9,
                  alignItems: "center",
                  marginTop: 10,
                  borderRadius: 30,
                  borderColor: "blue",
                  borderWidth: 1
                }}
              >
                <Text
                  style={{
                    color: "blue",
                    padding: 20,
                    fontSize: 18,
                    fontWeight: "700"
                  }}
                >
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#fff",
    flex: 1,
    height: screenHeight,
    zIndex: -2
  },
  headerLogoContainer: {
    alignItems: "center",
    marginTop: screenHeight * 0.1
  },
  headerStyle: {
    fontSize: 62,
    color: "black",
    fontWeight: "500"
  },
  verifyTextContainer: {
    alignItems: "center",
    marginTop: 20
  },
  verifyTextStyle: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  buttonsViewContainer: {
    position: "absolute",
    height: "100%",
    width: screenWidth,
    justifyContent: "flex-end",
    marginTop: Platform.OS === 'android' ? -24 : 0
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      refreshEmailVerified: refreshEmailVerified,
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(Unverified);
