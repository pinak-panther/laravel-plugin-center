import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import {customGetUserByToken, getUserByToken} from "./authCrud";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  SetUser: "[Set User] Action",
  CustomLogin: "[CustomLogin] Action",
  CustomUserRequested: "[Custom Request User] Action",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
};

export const reducer = persistReducer(
  { storage, key: "v726-demo1-auth", whitelist: ["authToken","user"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;
        return { authToken, user: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;
        return { authToken, user: undefined };
      }

      case actionTypes.Logout: {
        // TODO: Change this code. Actions in reducer aren't allowed.
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        return { ...state, user };
      }

      case actionTypes.SetUser: {
        const { user } = action.payload;
        return { ...state, user };
      }

     case actionTypes.CustomLogin: {
        const { authToken } = action.payload;
        return {...state, authToken};
     }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (authToken) => ({ type: actionTypes.Login, payload: { authToken } }),
  register: (authToken) => ({
    type: actionTypes.Register,
    payload: { authToken },
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: (user) => ({
    type: actionTypes.UserRequested,
    payload: { user },
  }),
  fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setUser: (user) => ({ type: actionTypes.SetUser, payload: { user } }),
  customLogin: (authToken) => ({ type: actionTypes.CustomLogin, payload: { authToken } }),
  customRequestUser: (user) => ({type: actionTypes.CustomUserRequested,payload: { user }}),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
      const { data: user } = yield getUserByToken();

      yield put(actions.fulfillUser(user));
  });

  yield takeLatest(actionTypes.CustomLogin, function* customLoginSaga() {
        yield put(actions.customRequestUser());
    });

  yield takeLatest(actionTypes.CustomUserRequested, function* customUserRequested() {
      const { data } = yield customGetUserByToken();
      yield put(actions.fulfillUser(data.data));
  });
}
