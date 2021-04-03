import { DEPARTAMENTS_GET } from "../types";

export function getDepsAction(deps) {
  return {
    type: DEPARTAMENTS_GET,
    payload: deps
  }
}