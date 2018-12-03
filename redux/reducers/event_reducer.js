import * as T from "../actions/types";

const INITIAL_STATE = {
  eventName: "",
  eventDescription: "",
  eventDate: {
    month: "",
    day: "",
    year: ""
  },
  eventHost: "",
  eventCategories: [],
  eventCoordinates: {
    latitude: 1,
    longitude: 1
  },
  eventLocation: {
    locationAddress: "",
    locationName: ""
  },
  eventTime: {
    startTime: "",
    endTime: ""
  },
  eventType: "Public",
  eventImage: {
    uri:
      "http://aooevents.com/wp-content/themes/invictus_3.3/images/dummy-image.jpg"
  },
  eventContact: "",
  eventID: "",
  tempEventImage: {
    uri:
      "http://aooevents.com/wp-content/themes/invictus_3.3/images/dummy-image.jpg"
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.UPDATE_EVENT_INFO:
      return {
        ...state,
        [action.payload.prop]: action.payload.value
      };
    default:
      return state;
  }
};
