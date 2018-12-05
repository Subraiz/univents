import * as T from "../actions/types";

const INITIAL_STATE = {
  allEvents: [],
  popularEvents: [],
  suggestionEvents: [],
  school: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.START_FETCH:
      return { ...state, loading: true };
    case T.FETCH_EVENTS:
      console.log(action.payload);
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        loading: false
      };
    default:
      return state;
  }
};
