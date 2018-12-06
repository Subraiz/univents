import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import reducers from "../redux/reducers";
import { AsyncStorage } from "react-native";

const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(ReduxThunk),
    autoRehydrate()
  )
);

// persistStore(store, { storage: AsyncStorage, whitelist: ["user"] });

export default store;
