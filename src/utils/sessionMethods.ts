import {randomBytes} from "node:crypto"

export function createSessionID() {
  return randomBytes(16).toString("base64")
}