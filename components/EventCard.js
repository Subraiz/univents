import React from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { CachedImage } from "react-native-cached-image";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EventCard = ({ event, onPress }) => {
  let { month, day, year } = event.eventDate;
  let eventDate = `${month} ${day}, ${year}`;

  let { locationAddress, locationName } = event.eventLocation;
  let eventLocation = `${locationName} ~ ${locationAddress}`;

  let eventName = event.eventName;
  let hostName = event.eventHost;

  let { startTime, endTime } = event.eventTime;
  eventTime = `${startTime} - ${endTime}`;

  return (
    <View
      style={{
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "lightgrey",
        shadowOpacity: 0.7,
        shadowRadius: 10
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}
      >
        <Image
          style={{
            width: "100%",
            height: "40%",
            opacity: 0.7
          }}
          source={event.eventImage}
        />
        <View style={styles.opacityContainer} />

        <View
          style={{
            width: "100%",
            height: "60%",
            backgroundColor: "white",
            flexDirection: "column",
            paddingTop: 10,
            paddingBottom: 10,
            paddingRight: 15,
            paddingLeft: 15,
            justifyContent: "space-between"
          }}
        >
          <View>
            <Text style={styles.eventNameStyle}>{eventName}</Text>
            <Text style={styles.hostNameStyle}>{hostName}</Text>
          </View>
          <View>
            <Text style={styles.dateStyle}>
              {eventDate} • {eventTime}
            </Text>

            <Text style={styles.locationStyle}>{eventLocation}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    height: screenHeight * 0.28,
    width: screenWidth * 0.85,
    borderRadius: 15,
    marginLeft: 10,
    marginTop: 4,
    overflow: "hidden"
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

export default EventCard;
