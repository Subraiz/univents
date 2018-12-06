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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EventCard = ({ event, onPress }) => {
  let { month, day, year } = event.getEventDate();
  let eventDate = `${month} ${day}, ${year}`;

  let { locationAddress, locationName } = event.getEventLocation();
  let eventLocation = `${locationName} - ${locationAddress}`;

  let eventName = event.getEventName();
  let hostName = event.getEventHost();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <Image
        style={styles.imageStyle}
        borderRadius={10}
        source={event.getEventImage()}
      />
      <View style={styles.opacityContainer} />

      <View style={styles.textContainer}>
        <Text style={styles.dateStyle}>{eventDate}</Text>
        <Text style={styles.eventNameStyle}>{eventName}</Text>
        <Text style={styles.hostNameStyle}>{hostName}</Text>
        <Text style={styles.locationStyle}>{eventLocation}</Text>
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
        console.log(gesture.vx);
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
    return (
      <EventCard
        key={item.item.getEventName()}
        event={item.item}
        navigation={this.props.navigation}
        onPress={this.onPress.bind(this, item.item)}
      />
    );
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
    fontWeight: "500",
    marginLeft: 8,
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
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 4
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
    color: "red",
    fontWeight: "500"
  },
  eventNameStyle: {
    fontSize: 19,
    color: "white",
    fontWeight: "600"
  },
  hostNameStyle: {
    fontSize: 15,
    color: "white"
  },
  locationStyle: {
    fontSize: 15,
    color: "white"
  }
};

export default EventCardsRow;
