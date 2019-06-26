import * as T from "../actions/types";

const INITIAL_STATE = {
  eventName: "",
  eventDescription: "",
  eventLinks: [],
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
  eventPin: {
    uri:
      "https://firebasestorage.googleapis.com/v0/b/univents-a5f76.appspot.com/o/Pins%2FsplurgePin.png?alt=media&token=4d159e75-129c-4df6-9363-fd778abfff84"
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
