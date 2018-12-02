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
  eventImage: { uri: "url" },
  eventContact: "",
  eventID: ""
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
