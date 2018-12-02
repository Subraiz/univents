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
  FlatList
} from "react-native";
import EventCardsRow from "./EventCardsRow";
import FilterButtonGroup from "./FilterButtonGroup";
import DummyData from "../constants/DummyData";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const swipeThreshold = 0.32 * screenHeight;

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
    LayoutAnimation.spring();
  }

  animate(direction) {
    if (direction == "up") {
      Animated.spring(this.state.position, {
        duration: 300,
        toValue: { x: 0, y: -screenHeight * 0.451 }
      });
      this.setState({ activated: true, scroll: true });
      this.state.position.setValue({ x: 0, y: -screenHeight * 0.451 });
    } else {
      Animated.spring(this.state.position, {
        toValue: { x: 0, y: 0 }
      }).start();
      this.setState({ scroll: false });
    }
    //
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

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
    this.setState({ scroll: false, activated: false });
  }

  render() {
    return (
      <View>
        <Animated.View
          style={[this.state.position.getLayout()]}
          {...this.state.panResponder.panHandlers}
        >
          <View style={styles.shadowView} />
          <View>
            <View
              style={styles.exploreContainer}
              {...this.state.panResponderForBar.panHandlers}
            >
              <Animated.View style={[this.getBarStyle()]}>
                <View style={styles.iconContainerStyle}>
                  <Image
                    source={require("../assets/images/ArrowUp.png")}
                    style={styles.iconStyle}
                  />
                </View>
              </Animated.View>
              <Text style={styles.headerTextStyle}>Explore Events</Text>
              <FilterButtonGroup />
            </View>
            <View style={styles.scrollViewContainer}>
              <ScrollView
                style={styles.scrollViewStyle}
                scrollEnabled={this.state.scroll}
                ref="scrollView"
              >
                <View style={styles.container}>
                  <EventCardsRow
                    scroll={this.state.scroll}
                    data={DummyData}
                    title={"Popular Near You"}
                    navigation={this.props.navigation}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#F7F7F7",
    height: screenHeight * 2.12
  },
  exploreContainer: {
    backgroundColor: "white",
    height: screenHeight * 0.21
  },
  eventsContainer: {
    backgroundColor: "white",
    height: screenHeight * 0.35,
    marginTop: 8
  },
  shadowView: {
    height: 2,
    backgroundColor: "#F7F7F7",
    shadowOffset: { width: 0, height: -2 },
    shadowColor: "black",
    shadowRadius: 8,
    shadowOpacity: 1
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
    fontWeight: "500"
  },
  iconStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  },
  iconContainerStyle: {
    width: 25,
    height: 25,
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 4
  }
};

export default Deck;
