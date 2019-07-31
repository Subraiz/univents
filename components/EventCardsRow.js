import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  UIManager,
  LayoutAnimation,
  ScrollView,
  PanResponder,
  FlatList,
  Image
} from "react-native";

import EventCard from "./EventCard";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const NoEventCard = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        { alignItems: "center", justifyContent: "center" }
      ]}
    >
      <Image
        style={styles.imageStyle}
        borderRadius={10}
        source={{
          uri:
            "http://aooevents.com/wp-content/themes/invictus_3.3/images/dummy-image.jpg"
        }}
      />

      <View style={styles.textContainer}>
        <Text style={{ color: "white", fontWeight: "600", fontSize: 24 }}>
          Check Back Soon
        </Text>
      </View>
    </TouchableOpacity>
  );
};

class EventCardsRow extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true;
      },
      onPanResponderMove: (e, gesture) => {},
      onPanResponderRelease: (e, gesture) => {
        if (gesture.vx < -2) {
          this.refs.flatList.scrollToEnd();
          this.state.cardIndex = this.props.data.length - 1;
        } else if (gesture.vx > 2) {
          this.refs.flatList.scrollToIndex({ index: 0 });
          this.state.cardIndex = 0;
        } else {
          if (gesture.dx <= -20) {
            return this.scrollDirection("right");
          } else if (gesture.dx >= 20) {
            return this.scrollDirection("left");
          } else if (gesture.dx > -20 && gesture.dx < 20) {
            return this.scrollDirection("reset");
          }
        }

        return true;
      }
    });

    this.state = {
      ...this.state,
      panResponder,
      scrollEnabled: true,
      position,
      cardIndex: 0
    };
  }

  scrollDirection(direction) {
    if (direction == "left") {
      if (this.state.cardIndex != 0) {
        this.state.cardIndex--;
        this.refs.flatList.scrollToIndex({ index: this.state.cardIndex });
      } else {
        this.refs.flatList.scrollToIndex({ index: this.state.cardIndex });
      }
    } else if (direction == "right") {
      if (this.state.cardIndex != this.props.data.length - 1) {
        this.state.cardIndex++;
        this.refs.flatList.scrollToIndex({ index: this.state.cardIndex });
      } else {
        this.refs.flatList.scrollToIndex({ index: this.state.cardIndex });
      }
    } else {
      this.refs.flatList.scrollToIndex({ index: this.state.cardIndex });
    }
  }

  resetCardPosition() {
    this.state.position.setValue({ x: 0, y: 0 });
  }

  onPress(data) {
    this.props.navigation.navigate("EventInformation", {
      data: data,
      navigation: this.props.navigation
    });
  }

  renderEvent(item) {
    if (item.item.name == "EmptyEvent") {
      return <NoEventCard />;
    } else {
      return (
        <EventCard
          key={item.item.eventName}
          event={item.item}
          navigation={this.props.navigation}
          onPress={this.onPress.bind(this, item.item)}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.eventsContainer}>
        <Text style={styles.titleStyle}>{this.props.title}</Text>
        <FlatList
          {...this.state.panResponder.panHandlers}
          scrollEnabled={this.props.scroll}
          ref="flatList"
          horizontal={true}
          data={this.props.data}
          renderItem={this.renderEvent.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = {
  titleStyle: {
    fontFamily: "PublicSans-Regular",
    marginLeft: 20,
    marginTop: 5,
    fontSize: 20,
    paddingBottom: 5,
    paddingTop: 2
  },
  eventsContainer: {
    backgroundColor: "white",
    height: screenHeight * 0.35,
    marginTop: 8
  },
  container: {
    height: screenHeight * 0.28,
    width: screenWidth * 0.85,
    borderRadius: 15,
    marginLeft: 10,
    marginTop: 4,
    overflow: "hidden"
  },
  textContainer: {
    height: "100%",
    justifyContent: "flex-end",
    paddingBottom: 6,
    marginLeft: 6
  },
  imageStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.9
  },
  opacityContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 10,
    opacity: 0.25
  },
  dateStyle: {
    fontSize: 15,
    fontWeight: "300"
  },
  eventNameStyle: {
    fontSize: 22,
    fontWeight: "700"
  },
  hostNameStyle: {
    fontSize: 15,
    fontWeight: "400"
  },
  locationStyle: {
    fontSize: 15,
    fontWeight: "300",
    color: "grey"
  }
};

export default EventCardsRow;
