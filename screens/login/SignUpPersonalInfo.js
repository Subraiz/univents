import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
  Picker,
  UIManager,
  LayoutAnimation,
  Dimensions
} from "react-native";
import ImagePicker from "react-native-image-picker";
import { FormLabel, FormInput } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUserInfo } from "../../redux/actions/LoginActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const male0 = require("../../assets/images/male0.png");
const female0 = require("../../assets/images/female0.png");
const male1 = require("../../assets/images/male1.png");
const female1 = require("../../assets/images/female1.png");

class SignUpPersonalInfo extends Component {
  state = {
    male: male0,
    female: female0
  };

  renderButton() {
    if (this.props.sex !== "" && this.props.major !== "") {
      return (
        <TouchableOpacity
          disabled={false}
          onPress={this.onNext.bind(this)}
          alignItems="center"
        >
          <View style={styles.selectedButtonStyle}>
            <Text style={{ color: "white", padding: 20, fontSize: 18 }}>
              Next
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          disabled={true}
          onPress={this.onNext.bind(this)}
          alignItems="center"
        >
          <View style={styles.buttonStyle}>
            <Text style={{ color: "white", padding: 20, fontSize: 18 }}>
              Next
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  onNext() {
    this.props.navigation.navigate("SignUpProfilePhoto");
  }

  onGenderSelect(gender) {
    if (gender === "male") {
      this.setState({ male: male1, female: female0 });
      this.props.updateUserInfo({ prop: "sex", value: "male" });
    } else {
      this.setState({ male: male0, female: female1 });
      this.props.updateUserInfo({ prop: "sex", value: "female" });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <FormLabel>Major</FormLabel>
          <FormInput
            containerStyle={{ borderBottomColor: "red" }}
            autoCorrect={true}
            onChangeText={text =>
              this.props.updateUserInfo({ prop: "major", value: text })
            }
            value={this.props.major}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.headerText}>Class Year</Text>
          <Picker
            style={{ marginRight: 20, marginLeft: 20 }}
            selectedValue={this.props.year}
            onValueChange={value =>
              this.props.updateUserInfo({ prop: "year", value })
            }
          >
            <Picker.Item label="Freshman" value="Freshman" />
            <Picker.Item label="Sophomore" value="Sophomore" />
            <Picker.Item label="Junior" value="Junior" />
            <Picker.Item label="Senior" value="Senior" />
          </Picker>
        </View>

        <View style={styles.section}>
          <Text style={styles.headerText}>Sex</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{ height: screenHeight * 0.1, width: 50, marginRight: 40 }}
              onPress={this.onGenderSelect.bind(this, "male")}
            >
              <Image source={this.state.male} style={styles.imageStyle} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ height: screenHeight * 0.1, width: 35, marginLeft: 40 }}
              onPress={this.onGenderSelect.bind(this, "female")}
            >
              <Image source={this.state.female} style={styles.imageStyle} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: 25 }}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    interests: state.user.interests,
    error: state.user.error,
    avatarSource: state.user.avatarSource,
    major: state.user.major,
    year: state.user.year,
    gender: state.user.sex
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUserInfo: updateUserInfo
    },
    dispatch
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7"
  },
  section: {
    marginTop: 10,
    backgroundColor: "white",
    paddingBottom: 5
  },
  headerText: {
    marginLeft: 20,
    fontSize: 16,
    marginTop: 10,
    color: "grey",
    fontWeight: "600"
  },
  imageStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  },
  buttonStyle: {
    width: screenWidth * 0.7,
    backgroundColor: "red",
    alignItems: "center",
    borderRadius: 7,
    opacity: 0.5
  },
  selectedButtonStyle: {
    width: screenWidth * 0.7,
    backgroundColor: "red",
    alignItems: "center",
    borderRadius: 7
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPersonalInfo);
