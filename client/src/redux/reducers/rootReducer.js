import { combineReducers } from "redux";
import { someReducer } from "./someReducer";
// import { appReducer } from "./appReducer";
// import { postsReducer } from "./postsReducer";

export const rootReducer = combineReducers({
  some: someReducer

})