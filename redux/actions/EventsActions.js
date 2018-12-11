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

export const fetchEvents = (state, user, type) => {
  // Create event categories
  let allEvents = [];
  let todaysEvents = [];
  let popularEvents = [];
  let suggestionEvents = [];
  let schoolEvents = [];

  // Get current date
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth() + 1;
  let currentDay = currentDate.getDate();
  let studentInterests = false;

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
      .orderBy("eventDate", "desc")
      .get()
      .then(data => {
        // Use some instead of forEach so it can break
        data.docs.some(doc => {
          let event = doc.data();
          let eventCategories = event.eventCategories;

          // Check if event categories match users interests or if event is checked as popular
          let commonInterest = eventCategories.some(
            category => studentInterests.indexOf(category) >= 0
          );

          let popular = eventCategories.indexOf("Popular") >= 0 ? true : false;

          // Create new Event Object
          let eventObject = {
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
            eventData: event.eventData
          };

          // Stop getting events once it hits the first event which is out of date
          let { month, day, year } = event.eventDate;
          month = months.indexOf(month) + 1;
          if (year <= currentYear) {
            if (month <= currentMonth) {
              if (day < currentDay) {
                return true;
              } else if (day == currentDay) {
                todaysEvents.push(eventObject);
              }
            }
          }

          // Sort events so most recent events are first in the array
          allEvents.unshift(eventObject);

          // Put events in respective categories

          if (studentInterests != false) {
            if (commonInterest) {
              suggestionEvents.unshift(eventObject);
            } else {
              schoolEvents.unshift(eventObject);
            }
          }

          if (popular) {
            popularEvents.unshift(eventObject);
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
          createdEvents.unshift(doc.data());
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
          favoritedEvents.unshift(doc.data());
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
