import {createClient} from "redis"
import {errDetails} from "../error/errDetails"

export const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379
  }
})

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err)
});

try {
  await redisClient.connect()
} catch (err) {
  console.error(errDetails(err))
}