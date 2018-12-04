import * as T from "./types.js";
import firebase from "@firebase/app";
require("@firebase/auth");
require("@firebase/firestore");
require("@firebase/storage");
import RNFetchBlob from "rn-fetch-blob";
import { Platform } from "react-native";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.Blob = Blob;

let auth;
let firestore;
let storage;
const initializeFirebase = async () => {
  auth = await firebase.auth();
  firestore = await firebase.firestore();
  storage = await firebase.storage();
  firestore.settings({ timestampsInSnapshots: true });
};

export const updateEventInfo = ({ prop, value }) => {
  return {
    type: T.UPDATE_EVENT_INFO,
    payload: { prop, value }
  };
};

export const publishEvent = event => {
  let uid = event.eventID.substring(0, event.eventID.length - 5);
  let user;
  return async dispatch => {
    await initializeFirebase();
    await firestore
      .collection("Location")
      .doc("MA")
      .collection("Events")
      .doc(event.eventID)
      .set(event)
      .then()
      .catch(error => console.log(error));

    await firestore
      .collection("Users")
      .doc(uid)
      .get()
      .then(doc => {
        user = doc.data();
        user.events.createdEvents.push(event);

        firestore
          .collection("Users")
          .doc(uid)
          .set(user)
          .then(() => {
            dispatch({ type: T.SAVE_USER, payload: user });
          });
      });

    dispatch({ type: T.CLEAR_EVENT_INFO });
  };
};

export const clearEventInfo = () => {
  return async dispatch => {
    dispatch({ type: T.CLEAR_EVENT_INFO });
  };
};

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export const uploadImage = (uri, mime, name, uid) => {
  let randomString = makeid();
  uid = uid + randomString;
  return async dispatch => {
    await initializeFirebase();
    const originalXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    return new Promise((resolve, reject) => {
      let imgUri = uri;
      let uploadBlob = null;
      const uploadUri =
        Platform.OS === "ios" ? imgUri.replace("file://", "") : imgUri;
      const imageRef = storage.ref(`EventPictures/${uid}`);
      fs.readFile(uploadUri, "base64")
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime, name: name });
        })
        .then(() => {
          uploadBlob.close();
          window.XMLHttpRequest = originalXMLHttpRequest;
          return imageRef.getDownloadURL();
        })
        .then(url => {
          console.log(url);
          let source = { uri: url };
          dispatch({
            type: T.UPDATE_EVENT_INFO,
            payload: { prop: "eventImage", value: source }
          });
          resolve(url);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
};
