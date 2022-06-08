import express from "express"
import {router} from "../routes"

export const app = express()

app.use(express.json())
  .use("/api", router.authRoutes)

