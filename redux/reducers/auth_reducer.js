import * as T from "../actions/types";

const INITIAL_STATE = {
  email: "",
  password: "",
  loading: false,
  error: "",
  authorized: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.UPDATE_LOGIN_INFO:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        error: ""
      };
    case T.START_LOGIN:
      return { ...state, loading: true, error: "" };
    case T.LOGIN_FAILED:
      return { ...state, error: "failed", loading: false, password: "" };
    case T.LOGIN_SUCCESS:
      return { ...INITIAL_STATE, authorized: true };
    default:
      return state;
  }
};
