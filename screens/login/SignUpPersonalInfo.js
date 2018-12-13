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
  Dimensions,
  Keyboard,
  FlatList,
  TextInput,
  Platform
} from "react-native";
import ImagePicker from "react-native-image-picker";
import { FormLabel, FormInput } from "react-native-elements";
import SegmentedControlTab from "react-native-segmented-control-tab";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUserInfo } from "../../redux/actions/LoginActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const majors = [
  "Computer Science",
  "Biology",
  "Finance",
  "Design",
  "Engineering"
];

class SignUpPersonalInfo extends Component {
  state = {
    selectedIndex: 0,
    showSearch: null,
    returnAnimation: "",
    modalAnimation: "slideOutRight",
    opacity: 0,
    searchedMajors: majors,
    searchValue: "",
    major: "Enter Major"
  };

  componentWillMount() {
    this.keyboardWillHide = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide.bind(this)
    );
    this.keyboardWillShow = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow.bind(this)
    );
  }

  handleBackPress() {
    return true;
  }

  keyboardWillShow() {
    if (this.state.searchValue == "") {
      this.handleSearch("");
    }
  }

  renderSearchItem(item) {
    return (
      <TouchableOpacity onPress={() => this.onListItemPress(item.item)}>
        <Animatable.View
          animation="fadeInUp"
          duration={250}
          style={{
            width: screenWidth * 0.95,
            paddingVertical: 10,
            paddingHorizontal: 10,
            alignSelf: "center",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottomWidth: 0.5,
            borderBottomColor: "white",
            flexDirection: "row"
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
            {item.item}
          </Text>
          <Icon
            name="md-arrow-forward"
            style={{ color: "white", fontSize: 16 }}
          />
        </Animatable.View>
      </TouchableOpacity>
    );
  }

  onListItemPress(item) {
    this.setState({
      showSearch: false,
      returnAnimation: "slideInLeft",
      modalAnimation: "slideOutDown",
      searchValue: "",
      searchedEvents: [],
      major: item
    });
    this.props.updateUserInfo({ prop: "major", value: item });
  }

  renderSearches() {
    return (
      <Animatable.View
        duration={600}
        animation={this.state.modalAnimation}
        style={{
          position: "absolute",
          marginTop: screenHeight * 0.07,
          width: screenWidth,
          height: screenHeight,
          paddingBottom: screenHeight * 0.55,
          backgroundColor: "rgba(0,0,0,.5)",
          opacity: this.state.opacity,
          flex: 1
        }}
      >
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={this.state.searchedMajors}
          renderItem={this.renderSearchItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animatable.View>
    );
  }

  keyboardWillHide() {
    this.setState({
      showSearch: false,
      returnAnimation: "slideInLeft",
      modalAnimation: "slideOutDown",
      searchValue: "",
      searchedMajors: []
    });
  }

  keyboardWillHide() {
    this.setState({
      showSearch: false,
      returnAnimation: "slideInLeft",
      modalAnimation: "slideOutDown",
      searchValue: "",
      searchedMajors: []
    });
  }

  handleSearch(text) {
    this.setState({ searchValue: text });
    let searchedMajors = [];
    if (text != "") {
      majors.forEach(major => {
        if (major.toLowerCase().includes(text.toLowerCase())) {
          searchedMajors.push(major);
        }
      });
    } else {
      searchedMajors = majors;
    }

    this.setState({ searchedMajors: searchedMajors });
  }

  onSearchPress() {
    this.setState({
      showSearch: true,
      opacity: 1,
      modalAnimation: "slideInUp"
    });
  }

  onReturn() {
    if (Platform.OS !== "ios") {
      this.setState({
        showSearch: false,
        returnAnimation: "slideInLeft",
        modalAnimation: "slideOutDown",
        searchValue: "",
        searchedEvents: []
      });
    }
    Keyboard.dismiss();
  }

  renderSearchBar() {
    if (this.state.showSearch) {
      return (
        <View>
          <Animatable.View
            duration={600}
            animation="slideInRight"
            style={{
              height: screenHeight * 0.05,
              backgroundColor: "white",
              borderRadius: 25,
              marginRight: 20,
              marginLeft: 20
            }}
          >
            <View
              style={{
                height: "100%",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10
              }}
            >
              <TouchableOpacity onPress={this.onReturn.bind(this)}>
                <Icon
                  name="md-arrow-back"
                  style={{ fontSize: 16, marginRight: 10 }}
                />
              </TouchableOpacity>
              <TextInput
                onChangeText={text => this.handleSearch(text)}
                value={this.state.searchValue}
                placeholder="Search"
                style={{ width: "95%", height: screenHeight * 0.04 }}
                autoFocus={true}
              />
            </View>
          </Animatable.View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={this.onSearchPress.bind(this)}
          style={{
            height: screenHeight * 0.05,
            backgroundColor: "white",
            borderRadius: 25,
            marginRight: 20,
            marginLeft: 20
          }}
        >
          <Animatable.View
            duration={500}
            animation={this.state.returnAnimation}
            style={{
              height: "100%",
              width: "95%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: 10
            }}
          >
            <Text
              style={{
                color: "grey",
                fontSize: 16,
                opacity: 1,
                fontWeight: "500",
                paddingLeft: 10
              }}
            >
              {this.state.major}
            </Text>
          </Animatable.View>
        </TouchableOpacity>
      );
    }
  }

  renderButton() {
    if (this.props.sex == "" || this.props.major == "") {
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
    } else {
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
    }
  }

  onNext() {
    this.props.navigation.navigate("SignUpProfilePhoto");
  }

  handleIndexChange(index) {
    if (index == 0) {
      this.setState({ selectedIndex: index });
      this.props.updateUserInfo({ prop: "sex", value: "male" });
    } else {
      this.setState({ selectedIndex: index });
      this.props.updateUserInfo({ prop: "sex", value: "female" });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <View style={styles.section}>{this.renderSearchBar()}</View>
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
            <View style={{ width: screenWidth * 0.8, alignSelf: "center" }}>
              <SegmentedControlTab
                values={["Male", "Female"]}
                selectedIndex={this.state.selectedIndex}
                onTabPress={this.handleIndexChange.bind(this)}
              />
            </View>
          </View>

          <View style={{ alignItems: "center", marginTop: 25 }}>
            {this.renderButton()}
          </View>
          <LottieView
            source={require("../../assets/animations/books.json")}
            autoPlay
            loop={false}
            style={{ alignSelf: "center", width: 200, height: 200 }}
          />
        </TouchableOpacity>
        {this.renderSearches()}
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
    backgroundColor: "#F7F7F7",
    height: screenHeight,
    width: screenWidth
  },
  section: {
    marginTop: 10,
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
    borderRadius: 35,
    opacity: 0.5
  },
  selectedButtonStyle: {
    width: screenWidth * 0.7,
    backgroundColor: "red",
    alignItems: "center",
    borderRadius: 35
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPersonalInfo);
