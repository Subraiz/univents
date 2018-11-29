import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signOutUser } from "../redux/actions/SettingsActions";

class ProfileAccountSettings extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  signOutUser() {
    this.props.signOutUser();
    this.props.navigation.navigate("Explore");
    this.props.navigation.navigate("Login");
  }
  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign Out" onPress={this.signOutUser.bind(this)} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ signOutUser: signOutUser }, dispatch);
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "white"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileAccountSettings);
