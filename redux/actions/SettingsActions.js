import * as T from "./types.js";
import firebase from "@firebase/app";
require("@firebase/auth");
require("@firebase/firestore");

let auth;
let firestore;
const initializeFirebase = async () => {
  auth = await firebase.auth();
  firestore = await firebase.firestore();
  firestore.settings({ timestampsInSnapshots: true });
};

export const signOutUser = () => {
  initializeFirebase();
  return async dispatch => {
    await firebase
      .auth()
      .signOut()
      .then(
        function() {
          dispatch({ type: T.CLEAR_USER });
        },
        function(error) {
          dispatch({ type: T.CLEAR_USER });
        }
      );
  };
};
