import * as T from "../actions/types";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.GET_CATEGORIES:
      return action.payload;
    default:
      return state;
  }
};
