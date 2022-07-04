import express from "express"
import {redisOtpStore, redisSessionStore} from "../../redis"
import {OtpVerifyRequest, PhoneValidityCheckRequest} from "./interfaces"
import {mergeCustomer} from "../../neo4j/methods/mergeCustomer"
import {mbClient} from "../../messagebird"
import {errDetails} from "../../error/errDetails"
import {sendOtpSms} from "../../messagebird/methods/sendOtpSms"
import {createSessionID} from "../../utils/sessionMethods";

const router = express.Router()

router.post("/verify-phone-number", async (req: PhoneValidityCheckRequest, res) => {
  const {phoneNumber} = req.body
  const otp = Math.floor(Math.random() * 10000).toString()

  try {
    const oldOtp = await redisOtpStore.v4.get(phoneNumber)

    console.log(oldOtp)

    if (!oldOtp) {
      try {
        // @ts-ignore
        await redisOtpStore.set(phoneNumber, otp, 'NX', 'EX', 300)
        await sendOtpSms(mbClient, phoneNumber, otp)
        res.sendStatus(200)
      } catch (error) {
        console.error(errDetails(error))
        res.sendStatus(500)
      }
    } else {
      try {
        await sendOtpSms(mbClient, phoneNumber, oldOtp)
        res.sendStatus(200)
      } catch (error) {
        console.error(errDetails(error))
        res.sendStatus(500)
      }
    }
  } catch (error) {
    console.error("Error trying to set OTP", errDetails(error))
    res.sendStatus(500)
  }
})

router.post("/verify-otp", async (req: OtpVerifyRequest, res) => {
  const {otpCode: sentOtp, phoneNumber} = req.body

  console.log("Sent phone number type:", typeof phoneNumber)

  const ipAddr = req.ip

  try {
    const redisOtp = await redisOtpStore.v4.get(phoneNumber)
    console.log("redisOtp", redisOtp, "sentOtp", sentOtp)
    if (redisOtp === sentOtp) {
      const sessionID = createSessionID()

      try {
        const [, userData,] = await Promise.all([
          // Delete otp key(phoneNumber) once user is verified
          redisOtpStore.del(phoneNumber),
          mergeCustomer(phoneNumber),
          redisSessionStore.json.set(sessionID, '.', {
            loginAttempt: 0,
            ipAddr,
            phoneNumber
          })
        ])

        console.log(userData)

        setTimeout(() => {
          res.status(200).json({
            sessionID,
            name: userData.name,
            email: userData.email
          })
        }, 1000)

      } catch (error) {
        console.error(errDetails(error))
        res.sendStatus(500)
      }
    } else {
      setTimeout(() => {
        res.sendStatus(401)
      }, 1000)
    }
  } catch (error) {
    console.error(errDetails(error))
    res.sendStatus(500)
  }
})

export {router as authRoutes}