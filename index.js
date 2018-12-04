/** @format */

import { AppRegistry } from "react-native";
import App from "./App";
import Root from "./Root";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => Root);
