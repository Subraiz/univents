import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  UIManager,
  LayoutAnimation,
  Platform,
  Alert
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import Terms from "../../constants/Terms.js";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import allMajors from "../../constants/Majors";
import { Button } from "../../components/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateUserInfo,
  checkForSignUpErrors,
  signUpUser,
  saveUser
} from "../../redux/actions/LoginActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class SignUpAbout extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    let currentYear = new Date().getFullYear();
    let schoolYears = [
      { value: "Graduate School" },
      { value: currentYear },
      { value: currentYear + 1 },
      { value: currentYear + 2 },
      { value: currentYear + 3 },
      { value: currentYear + 4 }
    ];

    let genders = [{ value: "Male" }, { value: "Female" }, { value: "Other" }];

    this.state = {
      firstName: "",
      lastName: "",
      schoolYears: schoolYears,
      selectedSchoolYear: "",
      majors: allMajors,
      selectedMajor: "",
      genders: genders,
      selectedGender: ""
    };
  }

  componentWillMount() {}

  checkForErrors = () => {
    if (
      this.state.firstName == "" ||
      this.state.lastName == "" ||
      this.state.selectedSchoolYear == "" ||
      this.state.selectedMajor == "" ||
      this.state.selectedGender == ""
    ) {
      Alert.alert(
        "Error",
        "Please fill out all fields",
        [
          {
            text: "Got It 👍",
            onPress: async () => {}
          }
        ],
        { cancelable: false }
      );
      return true;
    } else {
      return false;
    }
  };

  onButtonPress = async () => {
    if (!this.checkForErrors()) {
      this.props.updateUserInfo({
        prop: "lastName",
        value: this.state.lastName
      });
      this.props.updateUserInfo({
        prop: "firstName",
        value: this.state.firstName
      });
      this.props.updateUserInfo({
        prop: "major",
        value: this.state.selectedMajor
      });
      this.props.updateUserInfo({
        prop: "sex",
        value: this.state.selectedGender
      });
      this.props.updateUserInfo({
        prop: "year",
        value: this.state.selectedSchoolYear
      });
      this.props.navigation.navigate("SignUpProfilePhoto");
    }

    if (this.props.uid) {
      this.props.saveUser(this.props.user);
      this.props.navigation.navigate("SignUpProfilePhoto");
    }
  };

  renderContinue() {
    return (
      <View style={styles.buttonContainer}>
        <Button onPress={this.onButtonPress} title={"Continue"} />
      </View>
    );
  }

  renderDropdownBase = (title, value) => {
    return (
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 1,
          marginTop: 15,
          paddingBottom: 5
        }}
      >
        <Text style={styles.labelStyle}>{title}</Text>
        <View
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "grey",
              fontFamily: "PublicSans-Light",
              fontSize: 17
            }}
          >
            {value}
          </Text>
          <Icon
            name="ios-arrow-down"
            style={{ fontSize: 22, color: "black" }}
          />
        </View>
      </View>
    );
  };

  handleYearSelection = year => {
    this.setState({ selectedSchoolYear: String(year) });
  };

  hendleMajorSelection = major => {
    this.setState({ selectedMajor: major });
  };

  hendleGenderSelection = gender => {
    this.setState({ selectedGender: gender });
  };

  render() {
    console.log(this.props.user);
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tell us About Yourself</Text>
        </View>
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <View style={{ marginTop: 10 }}>
            <FormLabel labelStyle={styles.labelStyle}>First Name</FormLabel>
            <FormInput
              placeholder={"F. Name"}
              autoCorrect={false}
              containerStyle={styles.inputStyle}
              inputStyle={styles.textInputStyle}
              onChangeText={text => this.setState({ firstName: text })}
              value={this.state.firstName}
            />
            <FormLabel labelStyle={styles.labelStyle}>Last Name</FormLabel>
            <FormInput
              placeholder={"L. Name"}
              autoCorrect={false}
              containerStyle={styles.inputStyle}
              inputStyle={styles.textInputStyle}
              onChangeText={text => this.setState({ lastName: text })}
              value={this.state.lastName}
            />

            <Dropdown
              onChangeText={value => this.handleYearSelection(value)}
              itemCount={8}
              containerStyle={styles.dropdownContainer}
              renderBase={() =>
                this.renderDropdownBase(
                  "Class Year",
                  this.state.selectedSchoolYear
                )
              }
              overlayStyle={styles.dropdownOverlay}
              pickerStyle={styles.dropdownPicker}
              value={this.state.schoolYear}
              labelFontSize={16}
              label="Class Year"
              data={this.state.schoolYears}
              itemTextStyle={styles.itemTextStyle}
            />

            <Dropdown
              onChangeText={value => this.hendleMajorSelection(value)}
              itemCount={8}
              containerStyle={styles.dropdownContainer}
              renderBase={() =>
                this.renderDropdownBase("Major", this.state.selectedMajor)
              }
              overlayStyle={styles.dropdownOverlay}
              pickerStyle={styles.dropdownPicker}
              value={this.state.major}
              labelFontSize={16}
              label="Class Year"
              data={this.state.majors}
              itemTextStyle={styles.itemTextStyle}
            />

            <Dropdown
              onChangeText={value => this.hendleGenderSelection(value)}
              itemCount={8}
              containerStyle={styles.dropdownContainer}
              renderBase={() =>
                this.renderDropdownBase("Gender", this.state.selectedGender)
              }
              overlayStyle={styles.dropdownOverlay}
              pickerStyle={styles.dropdownPicker}
              value={this.state.major}
              labelFontSize={16}
              label="Class Year"
              data={this.state.genders}
              itemTextStyle={styles.itemTextStyle}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.footerContainer}>{this.renderContinue()}</View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    uid: state.user.uid,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    major: state.user.major,
    year: state.user.year,
    gender: state.user.sex
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUserInfo: updateUserInfo,
      checkForSignUpErrors: checkForSignUpErrors,
      signUpUser: signUpUser,
      saveUser: saveUser
    },
    dispatch
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "white"
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
    paddingBottom: 4
  },
  inputStyle: {
    borderBottomColor: "black"
  },
  textInputStyle: {
    fontFamily: "PublicSans-Light",
    color: "grey",
    fontSize: 17
  },
  labelStyle: {
    fontFamily: "PublicSans-Bold",
    color: "#86939F",
    fontSize: 15
  },
  headerContainer: {
    marginTop: screenHeight * 0.04,
    marginLeft: screenWidth * 0.04,
    paddingBottom: screenHeight * 0.05
  },
  termsContainer: {
    width: screenWidth * 0.7,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 20
  },
  termsTextStyle: {
    textAlign: "center",
    fontFamily: "PublicSans-Regular",
    fontSize: 16
  },
  buttonContainer: {
    alignSelf: "center"
  },
  headerTitleContainer: {
    marginTop: screenHeight * 0.02,
    paddingLeft: 18
  },
  headerTitle: {
    fontFamily: "PublicSans-Bold",
    fontSize: 20
  },
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 25
  },
  dropdownContainer: {
    width: "90%",
    alignSelf: "center"
  },
  dropdownOverlay: {
    backgroundColor: "rgba(0,0,0,.3)"
  },
  dropdownPicker: {
    borderRadius: 15
  },
  itemTextStyle: {
    fontFamily: "PublicSans-Light",
    paddingLeft: 8
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpAbout);
