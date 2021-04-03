import { LOGIN, LOGOUT } from "../types"

export function loginR(form) {
  console.log(form)
  return {
    type : LOGIN,
    payload: { ...form }
  }
}

export function logoutR() {
  return {
    type : LOGOUT
  }
}