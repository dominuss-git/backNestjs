import { hideLoader, showLoader } from "./loader.actions"

export function login() {
  return async dispatch => {
    try {
      dispatch(showLoader())
      setTimeout(() => {
        dispatch(hideLoader())
      }, 2000)
      return {
        
      }
    } catch (e) {
      
    }
  }
}

// export function hideLoader() {
//   return {
//     type: HIDE_LOADER
//   }
// }