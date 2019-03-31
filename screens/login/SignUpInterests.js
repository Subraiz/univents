import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Keyboard
} from "react-native";
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  SearchBar
} from "react-native-elements";
import { Button } from "../../components/common";
import InterestContainer from "../../components/InterestContainer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUserInfo, saveUser } from "../../redux/actions/LoginActions";
import { fetchEvents } from "../../redux/actions/EventsActions";
import firebase from "@firebase/app";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SignUpInterests extends Component {
  state = {
    interests: this.props.categories,
    likedInterests: [],
    searchValue: ""
  };

  static navigationOptions = {
    title: "Tell Us About Yourself",
    gesturesEnabled: false
  };

  async onPress() {
    await this.props.saveUser(this.props.user);
    let user = this.props.user;
    user.interest = this.state.likedInterests;
    await this.props.fetchEvents("MA", user);
    this.props.navigation.navigate("AppNavigator");
  }

  renderErrorMessage() {
    if (this.props.error != "") {
      <FormValidationMessage>
        Please select at least 5 interests
      </FormValidationMessage>;
    }
  }

  renderInterests() {
    return this.state.interests.map(interest => {
      return (
        <InterestContainer
          onPress={this.onInterestPress.bind(this, interest)}
          interest={interest}
          key={interest.item}
          title={interest.item}
          colors={interest.colors}
        />
      );
    });
  }

  updateSearchedInterests(e) {
    console.log(e);
    this.setState({ searchValue: e });
    let newInterests = [];
    this.state.interests.forEach(interest => {
      if (interest.item.includes(e)) {
        newInterests.push(interest);
      }
    });

    this.setState({ interests: newInterests });
  }

  onInterestPress(interest) {
    Keyboard.dismiss();
    interest.selected = !interest.selected;
    updatedLikedInterests = this.state.likedInterests;
    if (interest.selected) {
      updatedLikedInterests.push(interest.item);
      this.setState({
        likedInterests: updatedLikedInterests
      });
    } else {
      let indexToRemove = updatedLikedInterests.indexOf(interest.item);
      updatedLikedInterests.splice(indexToRemove, 1);
      this.setState({
        likedInterests: updatedLikedInterests
      });
    }
    this.updateSearchedInterests("");
    this.props.updateUserInfo({
      prop: "interests",
      value: this.state.likedInterests
    });
  }

  renderButton() {
    if (this.props.interests.length >= 1) {
      return (
        <Button
          style={{ alignSelf: "center", borderRadius: 7 }}
          title="Complete"
          onPress={this.onPress.bind(this)}
        />
      );
    } else {
      return (
        <Button
          activeOpacity={1}
          disable
          style={{ alignSelf: "center", opacity: 0.5, borderRadius: 7 }}
          title="Complete"
          onPress={this.onPress.bind(this)}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logoStyle}
                source={require("../../assets/images/UniventsLogo.png")}
              />
            </View>
            <Text>What are your interests?</Text>
          </View>

          <View>
            <SearchBar
              containerStyle={styles.searchBar}
              round
              lightTheme
              showLoading
              searchIcon={{ size: 24 }}
              onChangeText={this.updateSearchedInterests.bind(this)}
              placeholder="Type Here..."
              value={this.state.searchValue}
            />
          </View>

          <View style={styles.interestsContainer}>
            {this.renderInterests()}
          </View>
          <View style>{this.renderButton()}</View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "white",
    height: screenHeight
  },
  logoStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  },
  logoContainer: {
    width: 35,
    height: 42,
    paddingBottom: 8
  },
  headerContainer: {
    marginTop: screenHeight * 0.04,
    marginLeft: screenWidth * 0.04,
    paddingBottom: screenHeight * 0.05
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: screenHeight * 0.1,
    height: screenHeight * 0.4
  },
  searchBar: {
    alignSelf: "center",
    width: screenWidth * 0.9,
    backgroundColor: "rgba(0,0,0,0)",
    borderBottomColor: "red",
    borderBottomWidth: 0.4,
    borderTopColor: "rgba(0,0,0,0)",
    marginBottom: 10
  }
};

const mapStateToProps = state => {
  return {
    user: state.user,
    interests: state.user.interests,
    error: state.user.error,
    categories: state.settings
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUserInfo: updateUserInfo,
      saveUser: saveUser,
      fetchEvents: fetchEvents
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpInterests);
