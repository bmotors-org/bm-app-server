import express from "express"
import morgan from "morgan"
import helmet from "helmet";
import {baseFragment, router} from "../routes"
import "../redis"
import "../neo4j"

export const app = express()

app.set("trust proxy", true)

app
  .use(helmet())
  .use(express.json())
  .use(`${baseFragment}/auth`, router.authRoutes)
  .use(`${baseFragment}/profile`, router.profileRoutes)
  .use(morgan("tiny"))



