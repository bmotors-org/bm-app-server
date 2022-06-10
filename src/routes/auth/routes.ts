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
        const delKey = await redisClient.del(phoneNumber)
        console.log("Deled key:", delKey)

        try {
          const customer = await createCustomer(phoneNumber)

          console.log("Created customer:", customer.records)
          console.log("Query summary:", customer.summary)

          res.json({
            status: "success",
            message: "OTP verified successfully"
          })
        } catch (error) {
          console.error(errDetails(error))

          res.json({
            status: "error",
            message: "Error while creating profile"
          })
        }
      } catch (error) {
        console.error(errDetails(error))

        res.json({
          success: false,
          message: "Error deleting key from redis",
        })
      }
    }
  } catch (error) {
    console.error(errDetails(error))

    res.json({
      success: false,
      message: "Error getting key from redis",
    })
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
            res.json({
              status: "success",
              message: "OTP sent successfully"
            })
          }
        } catch (error) {
          console.error(errDetails(error))

          res.json({
            status: "error",
            message: "Error while sending OTP"
          })
        }
      } catch (error) {
        console.error(errDetails(error))

        res.json({
          success: false,
          message: "Error retrieving otp",
        })
      }
    } else {
      try {
        const response = await sendOtpSms(mbClient, phoneNumber, oldVal)
        console.log("Sent OTP SMS:", response)

        if (response) {
          res.json({
            status: "success",
            message: "OTP sent successfully"
          })
        }
      } catch (error) {
        console.error(errDetails(error))

        res.json({
          success: false,
          message: "Error while sending OTP"
        })
      }
    }
  } catch (error) {
    console.error(errDetails(error))

    res.json({
      success: false,
      message: "Error setting key in redis",
    })
  }
})

export {router as authRoutes}