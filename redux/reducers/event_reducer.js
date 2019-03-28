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
  },
  eventData: {
    currentAttendance: 0,
    usersAttended: []
  },
  eventOrder: 0,
  canceled: false,
  uploading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.UPDATE_EVENT_INFO:
      return {
        ...state,
        [action.payload.prop]: action.payload.value
      };
    case T.CLEAR_EVENT_INFO:
      return INITIAL_STATE;
    case T.START_PUBLISH:
      return { ...state, uploading: true };
    case T.PUBLISH_SUCCESS:
      return { ...state, uploading: false };
    case T.PUBLISH_FAIL:
      return { ...state, uploading: "failed" };
    default:
      return state;
  }
};
