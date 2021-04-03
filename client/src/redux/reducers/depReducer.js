import { DEPARTAMENTS_GET } from "../types"

const InitialState = { 
  deps : ''
}

export const depReducer = (state=InitialState, action) => {
  switch (action.type) {
    case DEPARTAMENTS_GET: 
      return { ...state, deps : action.payload }

    default:
      return state
  }
  
}