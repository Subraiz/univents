import * as T from "./types.js";
import firebase from "@firebase/app";
require("@firebase/auth");
require("@firebase/firestore");
require("@firebase/storage");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let auth;
let firestore;
let storage;
const initializeFirebase = async () => {
  auth = await firebase.auth();
  firestore = await firebase.firestore();
  storage = await firebase.storage();
  firestore.settings({ timestampsInSnapshots: true });
};

export const storeLocalEvents = (eventArray, type) => {
  return dispatch => {
    dispatch({
      type: T.STORE_LOCAL_EVENT,
      payload: { prop: type, value: eventArray }
    });
  };
};

export const getSpecialEvent = () => {
  let specialEventInfo = {
    specialEventActive: false,
    specialEventTitle: ""
  };

  return async dispatch => {
    await initializeFirebase();
    await firebase
      .firestore()
      .collection("Location")
      .doc("MA")
      .collection("SpecialEvent")
      .doc("SpecialEvent")
      .get()
      .then(doc => {
        specialEventInfo = doc.data();
      });
    dispatch({ type: T.GET_SPECIAL_EVENT, payload: specialEventInfo });
  };
};

export const fetchEvents = (state, user, type) => {
  // Create event categories
  let allEvents = [];
  let todaysEvents = [];
  let popularEvents = [];
  let suggestionEvents = [];
  let schoolEvents = [];
  let specialEvents = [];

  // Get current date
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();
  let currentDay = currentDate.getDate();
  let studentInterests = false;

  let lastEventOrder = currentYear + currentMonth / 11 + currentDay / 1000;
  lastEventOrder = Math.floor(lastEventOrder * 1000000) / 1000000;

  // Check if user is logged in
  if (user) {
    studentInterests = user.interests;
  }

  return async dispatch => {
    if (type == "update") {
      dispatch({ type: T.FETCH_START });
    }
    await initializeFirebase();
    await firestore
      .collection("Location")
      .doc("MA")
      .collection("Events")
      .orderBy("eventOrder", "desc")
      .get()
      .then(data => {
        // Use some instead of forEach so it can break
        data.docs.some(doc => {
          let pastEvent = false;
          let event = doc.data();

          if (!event.canceled) {
            let eventCategories = event.eventCategories;

            // Check if event categories match users interests or if event is checked as popular
            let commonInterest = eventCategories.some(
              category => studentInterests.indexOf(category) >= 0
            );

            let popular =
              eventCategories.indexOf("Popular") >= 0 ? true : false;

            let specialEvent =
              eventCategories.indexOf("Special Event") >= 0 ? true : false;

            // Create new Event Object
            let eventObject = {
              canceled: event.canceled,
              eventName: event.eventName,
              eventDescription: event.eventDescription,
              eventDate: event.eventDate,
              eventHost: event.eventHost,
              eventCategories: event.eventCategories,
              eventCoordinates: event.eventCoordinates,
              eventLocation: event.eventLocation,
              eventTime: event.eventTime,
              eventType: event.eventType,
              eventImage: event.eventImage,
              eventContact: event.eventContact,
              eventID: event.eventID,
              eventData: event.eventData,
              eventOrder: event.eventOrder
            };

            // Stop getting events once it hits the first event which is out of date
            let { month, day, year } = event.eventDate;
            let { eventOrder } = event;

            month = months.indexOf(month) + 1;
            if (eventOrder < lastEventOrder) {
              pastEvent = true;
            } else if (eventOrder == lastEventOrder) {
              todaysEvents.unshift(eventObject);
            }

            if (!pastEvent) {
              // Sort events so most recent events are first in the array
              allEvents.unshift(eventObject);

              // Put events in respective categories
              if (studentInterests != false) {
                if (commonInterest) {
                  suggestionEvents.unshift(eventObject);
                } else {
                  if (!specialEvent) {
                    schoolEvents.unshift(eventObject);
                  }
                }
              }

              if (popular) {
                popularEvents.unshift(eventObject);
              }

              if (specialEvent) {
                specialEvents.unshift(eventObject);
              }
            }
          }
        });

        // Check if we should add a delay or not
      })
      .catch(error => {
        console.log(error);
      });

    let delay = 0;
    if (type == "update") {
      delay = 1500;
    }
    setTimeout(() => {
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "allEvents", value: allEvents }
      });
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "todaysEvents", value: todaysEvents }
      });
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "popularEvents", value: popularEvents }
      });
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "suggestionEvents", value: suggestionEvents }
      });
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "schoolEvents", value: schoolEvents }
      });
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "specialEvents", value: specialEvents }
      });
    }, delay);
  };
};

export const fetchUserEvents = (user, type) => {
  let createdEvents = [];
  let favoritedEvents = [];
  return async dispatch => {
    await initializeFirebase();
    user.events.createdEvents.forEach(async event => {
      let refrenceArray = event.split("/");

      await firestore
        .collection(refrenceArray[0])
        .doc(refrenceArray[1])
        .collection(refrenceArray[2])
        .doc(refrenceArray[3])
        .get()
        .then(doc => {
          let event = doc.data();
          if (event) {
            if (!event.canceled) {
              createdEvents.unshift(doc.data());
            }
          } else {
            return;
          }
        });
    });

    user.events.favoritedEvents.forEach(async event => {
      let refrenceArray = event.split("/");

      await firestore
        .collection(refrenceArray[0])
        .doc(refrenceArray[1])
        .collection(refrenceArray[2])
        .doc(refrenceArray[3])
        .get()
        .then(doc => {
          let event = doc.data();
          if (event) {
            if (!event.canceled) {
              favoritedEvents.unshift(doc.data());
            }
          } else {
            return;
          }
        });
    });
    await dispatch({
      type: T.FETCH_USER_EVENTS,
      payload: { prop: "createdEvents", value: createdEvents }
    });
    dispatch({
      type: T.FETCH_USER_EVENTS,
      payload: { prop: "favoritedEvents", value: favoritedEvents }
    });
    dispatch({
      type: T.STORE_LOCAL_EVENT,
      payload: { prop: "createdEvents", value: createdEvents }
    });
    dispatch({
      type: T.STORE_LOCAL_EVENT,
      payload: { prop: "favoritedEvents", value: favoritedEvents }
    });
  };
};
