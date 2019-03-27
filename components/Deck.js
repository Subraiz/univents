import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  UIManager,
  LayoutAnimation,
  ScrollView,
  PanResponder,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import EventCardsRow from "./EventCardsRow";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchEvents } from "../redux/actions/EventsActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const swipeThreshold = 0.32 * screenHeight;

let emptyEvent = {
  name: "EmptyEvent"
};

let categories = [
  {
    name: "Food",
    iconName: "md-restaurant"
  },
  {
    name: "Music",
    iconName: "ios-musical-notes"
  },
  {
    name: "Sports",
    iconName: "ios-basketball"
  },
  {
    name: "Social",
    iconName: "ios-wine"
  },
  {
    name: "Fashion",
    iconName: "ios-shirt"
  },
  {
    name: "Art",
    iconName: "ios-color-palette"
  },
  {
    name: "Promotions",
    iconName: "ios-pricetags"
  },
  {
    name: "Technology",
    iconName: "ios-desktop"
  }
];

class Deck extends Component {
  state = {
    activated: false,
    scroll: false
  };

  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();

    const panResponderForBar = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (this.state.activated) {
          return true;
        }
      },
      onPanResponderMove: (e, gesture) => {
        //position.setValue({ x: 0, y: -screenHeight * 0.451 + gesture.dy });
      },
      onPanResponderRelease: (e, gesture) => {
        this.resetPosition();
      }
    });

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (!this.state.activated) {
          return true;
        }
      },
      onPanResponderMove: (e, gesture) => {
        if (!this.state.activated) {
          if (gesture.dy < 0) {
            position.setValue({ x: 0, y: gesture.dy });
          } else {
            position.setValue({ x: 0, y: gesture.dy - gesture.dy * 0.65 });
          }
        }
      },
      onPanResponderRelease: (e, gesture) => {
        if (!this.state.activated) {
          if (gesture.dy < -screenHeight * 0.15) {
            this.animate("up");
          } else {
            if (gesture.dy > screenHeight * 0.07) {
              this.props.fetchEvents("MA", this.props.user, "update");
            }
            this.resetPosition();
          }
        }
      }
    });

    this.state = {
      ...this.state,
      panResponder,
      panResponderForBar,
      position,
      index: 0
    };
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  renderSpinner() {
    if (this.props.loading) {
      return (
        <View style={{ marginTop: 5, marginBottom: 10 }}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <Image
          source={require("../assets/images/ArrowUp.png")}
          style={styles.iconStyle}
        />
      );
    }
  }

  animate(direction) {
    if (direction == "up") {
      Animated.timing(this.state.position, {
        toValue: { x: 0, y: -screenHeight * 0.451 }
      }).start(() =>
        this.state.position.setValue({ x: 0, y: -screenHeight * 0.451 })
      );
      this.setState({ activated: true, scroll: true });
    } else {
      Animated.spring(this.state.position, {
        toValue: { x: 0, y: 0 }
      }).start();
      this.setState({ scroll: false });
    }
  }

  renderPopularRow() {
    if (this.props.events.popularEvents.length != 0) {
      return (
        <EventCardsRow
          scroll={this.state.scroll}
          data={this.props.events.popularEvents}
          title={"Popular Near You"}
          navigation={this.props.navigation}
        />
      );
    } else {
      return (
        <EventCardsRow
          scroll={this.state.scroll}
          data={[emptyEvent]}
          title={"Popular Near You"}
          navigation={this.props.navigation}
        />
      );
    }
  }

  renderSuggestionsRow() {
    if (this.props.events.suggestionEvents.length != 0) {
      return (
        <EventCardsRow
          scroll={this.state.scroll}
          data={this.props.events.suggestionEvents}
          title={"Suggestions"}
          navigation={this.props.navigation}
        />
      );
    } else {
      return (
        <EventCardsRow
          scroll={this.state.scroll}
          data={[emptyEvent]}
          title={"Suggestions"}
          navigation={this.props.navigation}
        />
      );
    }
  }

  renderSchoolRow() {
    if (this.props.events.schoolEvents.length != 0) {
      return (
        <EventCardsRow
          scroll={this.state.scroll}
          data={this.props.events.schoolEvents}
          title={"School"}
          navigation={this.props.navigation}
        />
      );
    } else {
      return (
        <EventCardsRow
          scroll={this.state.scroll}
          data={[emptyEvent]}
          title={"School"}
          navigation={this.props.navigation}
        />
      );
    }
  }

  getBarStyle() {
    const { position } = this.state;
    const rotate = position.y.interpolate({
      inputRange: [-screenHeight * 0.451, 0, screenHeight * 0.451],
      outputRange: ["-180deg", "0deg", "0deg"]
    });

    return {
      transform: [{ rotate: rotate }]
    };
  }

  onExploreIconPress(text) {
    this.props.onIconPress(text);
  }

  resetPosition() {
    Animated.timing(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
    this.setState({ scroll: false, activated: false });
  }

  renderIcons() {
    return categories.map((category, i) => {
      return (
        <TouchableOpacity
          onPress={this.onExploreIconPress.bind(this, category.name)}
          key={category.iconName + i}
          style={{
            width: 55,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            marginLeft: 10,
            marginBottom: 10,
            marginRight: 10,
            alignItems: "center"
          }}
        >
          <Icon
            name={category.iconName}
            style={{ fontSize: 36, color: "#3f3f3f" }}
          />
          <Text style={{ fontSize: 9, fontWeight: "300" }}>
            {category.name}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <Animated.View
        style={[
          this.state.position.getLayout(),
          {
            width: screenWidth,
            marginTop: screenHeight * 0.45,
            height: "100%",
            zIndex: 4
          }
        ]}
        {...this.state.panResponder.panHandlers}
      >
        <View
          style={styles.exploreContainer}
          {...this.state.panResponderForBar.panHandlers}
        >
          <Animated.View style={[this.getBarStyle()]}>
            <View style={styles.arrowStyle}>{this.renderSpinner()}</View>
          </Animated.View>
          <Text style={styles.headerTextStyle}>Explore Events</Text>
          <View style={styles.iconsContainer}>{this.renderIcons()}</View>
        </View>

        <ScrollView
          scrollEnabled={this.state.scroll}
          ref="scrollView"
          style={styles.container}
        >
          {this.renderPopularRow()}
          {this.renderSuggestionsRow()}
          {this.renderSchoolRow()}
          <View style={{ height: 65 }} />
        </ScrollView>
      </Animated.View>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.events.loading,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchEvents: fetchEvents
    },
    dispatch
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F7F7"
  },
  exploreContainer: {
    backgroundColor: "white",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowRadius: 3,
    shadowOpacity: 0.3
  },
  eventsContainer: {
    backgroundColor: "white",
    marginTop: 8
  },
  titleStyle: {
    fontWeight: "500",
    marginLeft: 5,
    marginTop: 5,
    fontSize: 20
  },
  scrollViewContainer: {
    backgroundColor: "#F7F7F7"
  },
  topBarStyle: {
    alignSelf: "center",
    width: screenWidth * 0.25,
    height: 10,
    backgroundColor: "#B3B3B3",
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 5
  },
  headerTextStyle: {
    alignSelf: "center",
    color: "black",
    fontSize: 22,
    fontWeight: "300",
    marginBottom: 2
  },
  iconStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  },
  arrowStyle: {
    width: 25,
    height: 25,
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 4
  },
  iconsContainer: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: screenWidth * 0.1,
    flexWrap: "wrap"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Deck);
