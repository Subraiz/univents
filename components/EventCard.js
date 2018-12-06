import React from "react";
import { Text, View, Image, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EventCard = ({ event }) => {
  let { month, day, year } = event.getEventDate();
  let eventDate = `${month} ${day}, ${year}`;

  let { locationAddress, locationName } = event.getEventLocation();
  let eventLocation = `${locationName} - ${locationAddress}`;

  let eventName = event.eventName;
  let hostName = event.eventHost;

  return (
    <View style={styles.container}>
      <Image
        style={styles.imageStyle}
        borderRadius={10}
        source={event.eventImage}
      />
      <View style={styles.opacityContainer} />

      <View style={styles.textContainer}>
        <Text style={styles.dateStyle}>{eventDate}</Text>
        <Text style={styles.eventNameStyle}>{eventName}</Text>
        <Text style={styles.hostNameStyle}>{hostName}</Text>
        <Text style={styles.locationStyle}>{eventLocation}</Text>
      </View>
    </View>
  );
};

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

export default EventCard;
