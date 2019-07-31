import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  Keyboard,
  FlatList,
  TextInput,
  Linking,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SCHOOLS from "../../constants/schools";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUserInfo } from "../../redux/actions/LoginActions";

class SelectSchool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolValue: "",
      schools: SCHOOLS,
      disabled: true
    };
  }

  componentWillMount() {}

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  renderSchool(item) {
    let school = item.item;
    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => this.onSchoolSelect(school)}
      >
        <Image style={styles.schoolImage} source={school.logo} />
      </TouchableOpacity>
    );
  }

  onSchoolSelect(school) {
    this.setState({ schoolValue: school.school });
    this.checkIfValid(school.school);
  }

  onTextChange(text) {
    this.setState({ schoolValue: text });
    this.handleSchoolSearch(text);
  }

  handleSchoolSearch(text) {
    this.checkIfValid(text);
    let updatedSchoolsArray = [];
    SCHOOLS.forEach(school => {
      if (
        school.school
          .toLowerCase()
          .trim()
          .includes(text.toLowerCase().trim())
      ) {
        updatedSchoolsArray.push(school);
      }
    });
    this.setState({ schools: updatedSchoolsArray });
  }

  checkIfValid(text) {
    for (var i = 0; i < SCHOOLS.length; i++) {
      let school = SCHOOLS[i];
      if (school.school.toLowerCase().trim() == text.toLowerCase().trim()) {
        this.setState({ disabled: false });
        break;
      } else {
        this.setState({ disabled: true });
      }
    }
  }

  renderButton() {
    if (this.state.disabled) {
      return (
        <TouchableOpacity style={styles.inactiveButtonStyle} disabled={true}>
          <Text
            style={{
              color: "white",
              fontFamily: "PublicSans-Regular",
              fontSize: 16
            }}
          >
            Next
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.activeButtonStyle}
          onPress={this.handleNextPress.bind(this)}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "PublicSans-Regular",
              fontSize: 16
            }}
          >
            Next
          </Text>
        </TouchableOpacity>
      );
    }
  }

  handleNextPress() {
    this.props.updateUserInfo({
      prop: "school",
      value: this.state.schoolValue.trim()
    });
    this.props.navigation.navigate("SignUpForm");
  }

  renderList() {
    if (this.state.schools.length != 0) {
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          paddingEnabled
          horizontal={true}
          data={this.state.schools}
          renderItem={this.renderSchool.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    } else {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 32 }}>🙁</Text>
          <Text
            style={{ color: "rgba(0,0,0,.7)", marginBottom: 5, marginTop: 3 }}
          >
            Don't see your school?
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:splurgellc@gmail.com?")}
          >
            <Text style={{ color: "#147efb" }}>Email Us</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.titleStyle}>Choose your School</Text>
          <View style={styles.inputContainer}>
            <Icon name="md-school" style={{ fontSize: 36, color: "black" }} />
            <TextInput
              onChangeText={text => this.onTextChange(text)}
              value={this.state.schoolValue}
              autoFocus={true}
              style={styles.inputStyle}
              textAlign={"left"}
              placeholderTextColor="rgba(0,0,0,.4)"
              placeholder="Enter your college"
            />
          </View>
        </View>

        <View style={styles.schoolsContainer}>{this.renderList()}</View>
        <View style={styles.buttonContainer}>{this.renderButton()}</View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    school: state.user.school
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
    backgroundColor: "white"
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 25,
    paddingTop: 70
  },
  titleStyle: {
    marginTop: 10,
    color: "black",
    width: "90%",
    fontWeight: "800",
    fontSize: 20,
    fontFamily: "PublicSans-Regular"
  },
  inputContainer: {
    width: "90%",
    borderBottomWidth: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 2
  },
  inputStyle: {
    color: "black",
    fontSize: 16,
    fontFamily: "PublicSans-ExtraLight",
    paddingLeft: 15,
    width: "95%"
  },
  activeButtonStyle: {
    alignSelf: "center",
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 85,
    borderRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: -2, height: 2 },
    shadowRadius: 1
  },
  inactiveButtonStyle: {
    alignSelf: "center",
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, .7)",
    paddingVertical: 15,
    paddingHorizontal: 85,
    borderRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: -2, height: 2 },
    shadowRadius: 1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 25
  },
  schoolImage: {
    width: 75,
    height: 75
  },
  schoolsContainer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  imageContainer: {
    marginLeft: 12,
    marginRight: 12
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectSchool);
