import * as T from "./types.js";
import firebase from "@firebase/app";
require("@firebase/auth");
require("@firebase/firestore");
require("@firebase/storage");
import RNFetchBlob from "rn-fetch-blob";
import { Platform } from "react-native";

export const updateEventInfo = ({ prop, value }) => {
  return {
    type: T.UPDATE_EVENT_INFO,
    payload: { prop, value }
  };
};
