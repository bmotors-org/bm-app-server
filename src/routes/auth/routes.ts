import express from "express"
import {redisClient} from "../../redis"
import {OtpVerifyRequest, PhoneValidityCheckRequest} from "./interfaces"
import {mergeCustomer} from "../../neo4j/methods/mergeCustomer"
import {mbClient} from "../../messagebird"
import {errDetails} from "../../error/errDetails"
import {sendOtpSms} from "../../messagebird/methods/sendOtpSms"
import {signJwtRsa} from "../../jwt/signRsa";

const router = express.Router()

router.post("/verify-phone-number", async (req: PhoneValidityCheckRequest, res) => {
  const {phoneNumber} = req.body
  const otp = Math.floor(Math.random() * 10000).toString()

  try {
    const oldVal = await redisClient.set(phoneNumber, otp, {
      EX: 60 * 5, // 5 minutes
      NX: true, // Only set if key doesn't exist
      GET: true, // Return the value of the key
    })

    if (oldVal === null) {
      try {
        const newVal = await redisClient.get(phoneNumber)
        await sendOtpSms(mbClient, phoneNumber, newVal!)
        res.sendStatus(200)
      } catch (error) {
        console.error(errDetails(error))
        res.sendStatus(500)
      }
    } else {
      try {
        await sendOtpSms(mbClient, phoneNumber, oldVal)
        res.sendStatus(200)
      } catch (error) {
        console.error(errDetails(error))
        res.sendStatus(500)
      }
    }
  } catch (error) {
    console.error(errDetails(error))
    res.sendStatus(500)
  }
})

router.post("/verify-otp", async (req: OtpVerifyRequest, res) => {
  const {otpCode, phoneNumber} = req.body

  try {
    const value = await redisClient.get(phoneNumber)
    if (value === otpCode) {
      try {
        const [, , token] = await Promise.all([
          redisClient.del(phoneNumber),
          mergeCustomer(phoneNumber),
          signJwtRsa(phoneNumber)
        ])
        res.status(200).json({token})
      } catch (error) {
        console.error(errDetails(error))
        res.sendStatus(500)
      }
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    console.error(errDetails(error))
    res.sendStatus(500)
  }
})

router.get("/test-bearer", (req, res) => {
  console.log(req.header("Bearer"))
  res.sendStatus(200)
})

export {router as authRoutes}