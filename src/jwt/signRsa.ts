import * as jwt from "jsonwebtoken"
import {readFile} from "node:fs/promises"
import {homedir} from "os"
import {SignOptions} from "jsonwebtoken";
import {errDetails} from "../error/errDetails";

interface Options extends SignOptions {
  algorithm: "RS256"
}

export async function signJwtRsa(phoneNumber: string) {
  const home = homedir()
  const privateKeyPath = `${home}/.ssh/id_rsa`

  // Parameters for jwt.sign()
  const privateKey = await readFile(privateKeyPath, {encoding: "utf8"})
  const payload = {phoneNumber}
  const options: Options = {algorithm: "RS256"}
  const callback = (err: any, token: string) => {
    if (err) {
      console.error(errDetails(err))
    } else {
      console.info("JWT:", token)
    }
  }

  jwt.sign(payload, privateKey, options, callback)
}
