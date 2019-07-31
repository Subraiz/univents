import React from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import CacheImage from "./common/CacheImage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EventCard = ({ event, onPress }) => {
  let { month, day, year } = event.eventDate;
  let eventDate = `${month} ${day}, ${year}`;

  let { locationAddress, locationName } = event.eventLocation;
  let eventLocation = `${locationName}  -  ${locationAddress}`;

  let eventName = event.eventName;
  let hostName = event.eventHost;

  let startTimeArray = event.eventTime.startTime.split(":");
  let endTimeArray = event.eventTime.endTime.split(":");

  let startHour;
  let startMinute;
  let endHour;
  let endMinute;

  let startTimeOfDay = "AM";
  let endTimeOfDay = "AM";

  startHour = parseInt(startTimeArray[0]);
  if (startHour == 0) {
    startHour = 12;
    startTimeOfDay = "AM";
  } else if (startHour > 12) {
    startHour = startHour - 12;
    startTimeOfDay = "PM";
  }
  let startTime = `${startHour}:${startTimeArray[1]}`;

  endHour = parseInt(endTimeArray[0]);
  if (endHour > 12) {
    endHour = endHour - 12;
    endTimeOfDay = "PM";
  } else if (endHour == 0) {
    endHour = 12;
    timeOfDay = "AM";
  }
  let endTime = `${endHour}:${endTimeArray[1]}`;
  let eventTime = `${startTime}${startTimeOfDay} - ${endTime}${endTimeOfDay}`;

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}
      >
        <CacheImage
          style={{
            width: "100%",
            height: "55%",
            borderRadius: 9,
            opacity: 0.9
          }}
          uri={event.eventImage.uri}
        />

        <View
          style={{
            width: "100%",
            height: "60%",
            flexDirection: "column",
            paddingTop: 10,
            paddingBottom: 10,
            paddingRight: 15,
            paddingLeft: 5,
            justifyContent: "space-between"
          }}
        >
          <View>
            <Text style={styles.eventNameStyle}>{eventName}</Text>
            <Text style={styles.timeStyle}>
              {eventDate.toUpperCase()} @ {eventTime.toUpperCase()}
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
    height: screenHeight * 0.3,
    width: screenWidth * 0.85,
    marginLeft: 15,
    marginTop: 4,
    overflow: "scroll"
  },
  opacityContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    opacity: 0.25
  },

  eventNameStyle: {
    fontSize: 20,
    fontFamily: "PublicSans-SemiBold"
  },
  hostNameStyle: {
    fontSize: 15,
    fontWeight: "400"
  },
  locationStyle: {
    fontSize: 12,
    fontFamily: "PublicSans-Light",
    color: "black",
    paddingTop: 5
  },
  timeStyle: {
    color: "#92C83D",
    fontFamily: "PublicSans-Light",
    fontSize: 15,
    paddingTop: 2
  }
};

export default EventCard;
