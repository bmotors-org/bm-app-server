import express from "express"
import morgan from "morgan"
import {baseFragment, router} from "../routes"

const {default: helmet} = await import("helmet")

export const app = express()

app
  .use(helmet())
  .use(express.json())
  .use(`${baseFragment}/auth`, router.authRoutes)
  .use(morgan("tiny"))



