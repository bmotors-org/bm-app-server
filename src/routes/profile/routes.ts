import express from "express";
import {MergeEmailRequest, MergeNameRequest} from "./interfaces";
import {errDetails} from "../../error/errDetails";
import {mergeName} from "../../neo4j/methods/mergeName";
import {redisSessionStore} from "../../redis";
import {mergeEmail} from "../../neo4j/methods/mergeEmail";

const router = express.Router()

router.post("/merge-name", async (req: MergeNameRequest, res) => {
  const {name} = req.body

  const authHeader = req.get("Authorization")

  console.log("auth header is", authHeader)

  try {
    const phoneNumber = await redisSessionStore.json.get(authHeader, {
      path: ".phoneNumber"
    })
    console.log("redis phone number is", phoneNumber)
    await mergeName(name, phoneNumber.toString())
    res.sendStatus(200)
  } catch (err) {
    console.log(errDetails(err))
    res.sendStatus(500)
  }
})

router.post("/merge-email", async (req: MergeEmailRequest, res) => {
  const {email} = req.body

  const authHeader = req.get("Authorization")

  console.log("auth header is", authHeader)

  try {
    const phoneNumber = await redisSessionStore.json.get(authHeader, {
      path: ".phoneNumber"
    })
    console.log("redis phone number is", phoneNumber)
    await mergeEmail(email, phoneNumber.toString())
    res.sendStatus(200)
  } catch (err) {
    console.error(errDetails(err))
    res.sendStatus(500)
  }
})

export {router as profileRoutes}