import * as T from "../actions/types";

const INITIAL_STATE = {
  allEvents: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.FETCH_EVENTS:
      return {
        ...state,
        [action.payload.prop]: action.payload.value
      };
    default:
      return state;
  }
};
