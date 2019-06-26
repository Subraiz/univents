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
          <Text style={{ color: "rgba(0,0,0,.4)" }}>Next</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.activeButtonStyle}
          onPress={this.handleNextPress.bind(this)}
        >
          <Text>Next</Text>
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
          <Text style={styles.titleStyle}>
            Tap on your school logo to get started
          </Text>
          <TextInput
            onChangeText={text => this.onTextChange(text)}
            value={this.state.schoolValue}
            autoFocus={true}
            style={styles.inputStyle}
            textAlign={"center"}
            placeholderTextColor="rgba(255, 255, 255, .5)"
            placeholder="School Name"
          />
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
    backgroundColor: "#ffc8aa"
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  titleStyle: {
    marginTop: 10,
    color: "white",
    textAlign: "center",
    width: "90%",
    fontWeight: "800",
    fontSize: 20
  },
  inputStyle: {
    marginTop: 15,
    width: "80%",
    color: "white",
    fontSize: 16,
    paddingBottom: 4
  },
  activeButtonStyle: {
    alignSelf: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 85,
    borderRadius: 45,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: -2, height: 2 },
    shadowRadius: 1
  },
  inactiveButtonStyle: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255, .4)",
    paddingVertical: 15,
    paddingHorizontal: 85,
    borderRadius: 45,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: -2, height: 2 },
    shadowRadius: 1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36
  },
  schoolImage: {
    width: 100,
    height: 100
  },
  schoolsContainer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center"
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
