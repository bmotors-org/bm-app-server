import jwt from "jsonwebtoken"
import {SignOptions} from "jsonwebtoken";
import {errDetails} from "../error/errDetails";
import {keys} from "../keys";

interface Options extends SignOptions {
  algorithm: "RS256"
}

export function signJwtRsa(phoneNumber: string) {
  const secretOrPrivateKey = {
    key: keys.privateKey.key,
    passphrase: keys.privateKey.passphrase
  }
  const payload = {phoneNumber}
  const options: Options = {algorithm: "RS256"}

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (err: any, token: string) => {
      if (err) {
        console.error(errDetails(err))
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}
