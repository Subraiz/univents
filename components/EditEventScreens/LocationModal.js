import React, { Component } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Button
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class LocationModal extends Component {
  handleSelectedLocation(details) {
    let eventLocation = {
      locationAddress: details.formatted_address,
      locationName: this.props.locationName
    };
    let { lat, lng } = details.geometry.location;
    let eventCoordinates = { latitude: lat, longitude: lng };
    // this.props.updateEventInfo({
    //   prop: "eventCoordinates",
    //   value: eventCoordinates
    // });
    // this.props.updateEventInfo({ prop: "eventLocation", value: eventLocation });
    this.props.onClose();
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
        transparent={true}
      >
        <SafeAreaView style={styles.container}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              this.handleSelectedLocation(details);
            }}
            getDefaultValue={() => ""}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: "AIzaSyD9TguYtWagQaPpe7rL3NrVjcZpXE_KvI0",
              language: "en" // language of the results
            }}
            styles={{
              textInputContainer: {
                width: "100%"
              },
              description: {
                fontWeight: "bold"
              },
              predefinedPlacesDescription: {
                color: "#1faadb"
              }
            }}
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={
              {
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }
            }
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: "distance"
            }}
            filterReverseGeocodingByTypes={["locality"]}
          />
        </SafeAreaView>
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.9,
            marginLeft: screenWidth * 0.025
          }}
        >
          <Button title="Cancel" onPress={this.props.onClose} />
        </View>
      </Modal>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "white"
  }
};

export default LocationModal;
