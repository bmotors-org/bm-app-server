import {createClient} from "redis"
import {errDetails} from "../error/errDetails"

const socket = {
  host: "redis",
  port: 6379
}

export const redisOtpStore = createClient({
  socket,
  database: 0,
  legacyMode: true
})

export const redisSessionStore = createClient({
  socket,
  database: 1
})

redisOtpStore.on("error", (err) => {
  console.log("Redis Client Error", err)
});

redisSessionStore.on("error", (err) => {
  console.log("Redis Client Error", err)
})

try {
  await Promise.all([
    redisOtpStore.connect(),
    redisSessionStore.connect()
  ])
  console.log("redis connected successfully")
} catch (err) {
  console.error(errDetails(err))
}