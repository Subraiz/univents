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
import {
  Bars,
  Fashion,
  Food,
  More,
  Music,
  Promotions,
  Sports,
  Technology,
  Explore
} from "./common/icons";
import TabBarIcon from "./TabBarIcon";
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

const Icons = {
  bars: Bars,
  fashion: Fashion,
  food: Food,
  more: More,
  music: Music,
  promotions: Promotions,
  sports: Sports,
  technology: Technology
};

class Deck extends Component {
  state = {
    activated: false,
    scroll: false
  };

  constructor(props) {
    super(props);

    this.categories = [
      {
        name: "Bars"
      },
      {
        name: "Promotions"
      },
      {
        name: "Sports"
      },
      {
        name: "Technology"
      },
      {
        name: "Food"
      },
      {
        name: "Music"
      },
      {
        name: "Fashion"
      },
      {
        name: "More"
      }
    ];

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

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
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
      return <Animated.View style={[this.getBarStyle(), styles.iconStyle]} />;
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
          title={"Summer in Boston"}
          navigation={this.props.navigation}
        />
      );
    } else {
      return (
        <EventCardsRow
          scroll={this.state.scroll}
          data={[emptyEvent]}
          title={"Summer in Boston"}
          navigation={this.props.navigation}
        />
      );
    }
  }

  renderSpecialRow() {
    if (this.props.specialEventActive) {
      if (this.props.events.specialEvents.length != 0) {
        return (
          <EventCardsRow
            scroll={this.state.scroll}
            data={this.props.events.specialEvents}
            title={this.props.specialEventTitle}
            navigation={this.props.navigation}
          />
        );
      } else {
        return (
          <EventCardsRow
            scroll={this.state.scroll}
            data={[emptyEvent]}
            title={this.props.specialEventTitle}
            navigation={this.props.navigation}
          />
        );
      }
    } else {
      return null;
    }
  }

  getBarStyle() {
    const { position } = this.state;
    const bgColor = position.y.interpolate({
      inputRange: [-screenHeight * 0.451, 0, screenHeight * 0.451],
      outputRange: ["#e7e7e7", "#B3B3B3", "#B3B3B3"]
    });

    return {
      backgroundColor: bgColor
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
    return this.categories.map((category, i) => {
      let Icon = Icons[category.name.toLowerCase()];
      return (
        <TouchableOpacity
          onPress={this.onExploreIconPress.bind(this, category.name)}
          key={i}
          style={{
            width: 55,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            marginLeft: 15,
            marginTop: 10,
            marginBottom: 5,
            marginRight: 15,
            alignItems: "center"
          }}
        >
          <Icon width={40} height={40} />
          <Text
            style={{
              fontSize: 9,
              fontWeight: "300",
              marginTop: 6,
              marginBottom: 6
            }}
          >
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
          <View>
            <View style={styles.barStyle}>{this.renderSpinner()}</View>
          </View>
          <Text style={styles.headerTextStyle}>Explore Events</Text>
          <View style={styles.iconsContainer}>{this.renderIcons()}</View>
        </View>

        <ScrollView
          scrollEnabled={this.state.scroll}
          ref="scrollView"
          style={styles.container}
        >
          {this.renderPopularRow()}
          {this.renderSpecialRow()}
          {this.renderSuggestionsRow()}
          {this.renderSchoolRow()}
        </ScrollView>
      </Animated.View>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.events.loading,
    user: state.user,
    specialEventActive: state.events.specialEventActive,
    specialEventTitle: state.events.specialEventTitle
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
    paddingLeft: 25,
    color: "black",
    fontSize: 20,
    fontFamily: "PublicSans-Regular",
    marginBottom: 2
  },
  iconStyle: {
    width: screenWidth * 0.2,
    height: 7,
    borderRadius: 10
  },
  barStyle: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10
  },
  iconsContainer: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: screenWidth * 0.04,
    flexWrap: "wrap"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Deck);
