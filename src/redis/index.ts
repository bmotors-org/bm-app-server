import {createClient} from "redis"

export const client = createClient({
  socket: {
    host: "localhost",
    port: 6379
  }
})

client.on("error", (err) => {
  console.log("Redis Client Error", err)
});

(async () => {
  try {
    await client.connect()
  } catch (err) {
    console.error(err)
  }
})()