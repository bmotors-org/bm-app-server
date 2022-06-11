import express from "express"
import {redisClient} from "../../redis"
import {OtpVerifyRequest, PhoneValidityCheckRequest} from "./interfaces"
import {createCustomer} from "../../neo4j/methods/createCustomer"
import {mbClient} from "../../messagebird"
import {errDetails} from "../../error/errDetails"
import {sendOtpSms} from "../../messagebird/methods/sendOtpSms"

const router = express.Router()

router.post("/verify-otp", async (req: OtpVerifyRequest, res) => {
  const {otpCode, phoneNumber} = req.body

  try {
    const value = await redisClient.get(phoneNumber)
    if (value === otpCode) {
      try {
        await redisClient.del(phoneNumber)

        try {
          await createCustomer(phoneNumber)

          res.sendStatus(200)
        } catch (error) {
          console.error(errDetails(error))

          res.sendStatus(500)
        }
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
        try {
          const response = await sendOtpSms(mbClient, phoneNumber, newVal!)
          console.log("Sent OTP SMS:", response)

          if (response) {
            res.sendStatus(200)
          }
        } catch (error) {
          console.error(errDetails(error))

          res.sendStatus(500)
        }
      } catch (error) {
        console.error(errDetails(error))

        res.sendStatus(500)
      }
    } else {
      try {
        const response = await sendOtpSms(mbClient, phoneNumber, oldVal)
        console.log("Sent OTP SMS:", response)

        if (response) {
          res.sendStatus(200)
        }
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

export {router as authRoutes}