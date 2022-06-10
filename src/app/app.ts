import express from "express"
import morgan from "morgan"
import helmet from "helmet";
import {baseFragment, router} from "../routes"

export const app = express()

app
  .use(helmet())
  .use(express.json())
  .use(`${baseFragment}/auth`, router.authRoutes)
  .use(morgan("tiny"))



