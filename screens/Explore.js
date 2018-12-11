import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  StatusBar,
  Dimensions,
  UIManager,
  LayoutAnimation,
  BackHandler,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SearchBar } from "react-native-elements";
import SearchEventsModal from "../components/SearchEventsModal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchEvents, storeLocalEvents } from "../redux/actions/EventsActions";
import DummyData from "../constants/DummyData";
import Deck from "../components/Deck";
import Map from "../components/Map";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class Explore extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);
    // make sure this method gets the right scope, no matter how it's called
    this.state = {
      showSearch: null,
      returnAnimation: "",
      modalAnimation: "slideOutRight",
      opacity: 0,
      searchedEvents: this.props.events.allEvents,
      searchValue: ""
    };
  }

  handleBackPress() {
    return true;
  }

  keyboardWillShow() {
    if (this.state.searchValue == "") {
      this.handleSearch("");
    }
  }

  keyboardWillHide() {
    this.setState({
      showSearch: false,
      returnAnimation: "slideInLeft",
      modalAnimation: "slideOutDown",
      searchValue: "",
      searchedEvents: []
    });
  }

  componentDidMount() {
    this.keyboardWillHide = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide.bind(this)
    );
    this.keyboardWillShow = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow.bind(this)
    );
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
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

  onExploreIconPress(text) {
    this.setState({
      showSearch: true,
      searchValue: text,
      opacity: 1,
      modalAnimation: "slideInUp"
    });
    this.handleSearch(text);
  }

  onSearchPress() {
    this.setState({
      showSearch: true,
      opacity: 1,
      modalAnimation: "slideInUp"
    });
  }

  onListItemPress(item) {
    this.props.navigation.navigate("EventInformation", {
      data: item,
      navigation: this.props.navigation
    });
  }

  renderSearchBar() {
    if (this.state.showSearch) {
      return (
        <View>
          <Animatable.View
            duration={600}
            animation="slideInRight"
            style={{
              height: screenHeight * 0.03,
              backgroundColor: "white",
              borderRadius: 25
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
                style={{ width: "100%", height: screenHeight * 0.06 }}
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
            height: screenHeight * 0.03,
            backgroundColor: "white",
            borderRadius: 25
          }}
        >
          <Animatable.View
            duration={500}
            animation={this.state.returnAnimation}
            style={{
              height: "100%",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10
            }}
          >
            <Icon name="ios-search" style={{ fontSize: 16, marginRight: 10 }} />
          </Animatable.View>
        </TouchableOpacity>
      );
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
            {item.item.eventName}
          </Text>
          <Icon
            name="md-arrow-forward"
            style={{ color: "white", fontSize: 16 }}
          />
        </Animatable.View>
      </TouchableOpacity>
    );
  }

  handleSearch(text) {
    this.setState({ searchValue: text });
    let searchedEvents = [];
    if (text != "") {
      this.props.events.allEvents.forEach(event => {
        if (event.eventName.toLowerCase().includes(text.toLowerCase())) {
          searchedEvents.push(event);
        } else if (event.eventCategories.indexOf(text) >= 0) {
          searchedEvents.push(event);
        }
      });
    } else {
      searchedEvents = this.props.events.allEvents;
    }

    this.setState({ searchedEvents: searchedEvents });
  }

  renderSearches() {
    return (
      <Animatable.View
        duration={600}
        animation={this.state.modalAnimation}
        style={{
          position: "absolute",
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
          data={this.state.searchedEvents}
          renderItem={this.renderSearchItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animatable.View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>{this.renderSearchBar()}</View>
        <View style={{ flex: 1 }}>
          <Map
            navigation={this.props.navigation}
            events={this.props.todaysEvents}
          />
          <Deck
            navigation={this.props.navigation}
            events={this.props.events}
            onIconPress={this.onExploreIconPress.bind(this)}
          />

          {this.renderSearches()}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
    todaysEvents: state.events.todaysEvents,
    createdEvents: state.userEvents.createdEvents
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchEvents: fetchEvents,
      storeLocalEvents: storeLocalEvents
    },
    dispatch
  );
};

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    backgroundColor: "#FFFFFF",
    flex: 1
  },
  headerContainer: {
    width: screenWidth,
    height: screenHeight * 0.05,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
    justifyContent: "center"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explore);
