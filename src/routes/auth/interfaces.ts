import {Request} from "express"

export interface OtpVerifyRequest extends Request {
  body: {
    otpCode: string,
    phoneNumber: string
  }
}

export interface PhoneValidityCheckRequest extends Request {
  body: { phoneNumber: string }
}