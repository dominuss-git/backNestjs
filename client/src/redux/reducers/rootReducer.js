import { combineReducers } from "redux";
import { appReducer } from "./appReducer";
import { loginReducer } from "./loginReducer";

export const rootReducer = combineReducers({
  app: appReducer,
  login: loginReducer
})