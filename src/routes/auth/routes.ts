import express from "express"
import initMb from "messagebird"
import {client} from "../../redis"
import {keys} from "../../keys"
import {OtpVerifyRequest, PhoneValidityCheckRequest} from "./interfaces"
import {createCustomer} from "../../neo4j/methods/createCustomer"

const messagebird = initMb(keys.messagebird.testAccessKey)

const router = express.Router()

router.post("/verify-otp", (req: OtpVerifyRequest, res) => {
  const {otpCode, phoneNumber} = req.body

  client.get(phoneNumber).then(result => {
    console.log(result, `From key ${phoneNumber}`)
    if (result === otpCode) {
      client.del(phoneNumber).then(result => {
        console.log(result, `Deleted key ${phoneNumber}`)
      }).catch(err => {
        console.error(err)
      })

      createCustomer(phoneNumber).then(result => {
        console.log("customer created", result)
      }).catch(err => {
        console.error("DB operation failed", err)
      })

      res.json({
        success: true,
        message: "OTP verified"
      })
    }
  }).catch(e => {
    console.error(e)
  })
})

router.post("/verify-phone-number", (req: PhoneValidityCheckRequest, res) => {
  console.log(req.body, "here")
  const {phoneNumber} = req.body
  const otp = Math.floor(Math.random() * 10000).toString()

  client.setEx(phoneNumber, 60 * 5, otp).then(result => {
    console.log(result, "From redis")
  }).catch(e => {
    console.error(e)
  })

  messagebird.messages.create({
    originator: "TestMessage",
    recipients: [+8801934400089],
    body: "Your OTP is " + otp
  }, function (err, response) {
    if (err) {
      console.log("Messagebird Error:")
      console.error(err.message)
    } else {
      console.log("Messagebird success:")
      console.log(response.body)
    }
  })

  messagebird.balance.read(function (err, data) {
    if (err) {
      return console.error(err)
    }
    console.log(data)
  })

  res.send("Hello World")
})

export {router as authRoutes}