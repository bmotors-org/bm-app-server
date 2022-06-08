import {Request} from "express"

export interface OtpVerifyRequest extends Request {
  body: {
    code: string,
    number: string
  }
}

export interface PhoneValidityCheckRequest extends Request {
  body: { number: string }
}