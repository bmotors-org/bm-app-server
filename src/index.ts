import express from "express";
import {OGM} from "@neo4j/graphql-ogm";
import neo4j from "neo4j-driver";
import {createClient} from "redis";
import {typeDefs} from "./typeDefs";
import {resolvers} from "./resolvers";
import {router} from "./routes";
import "dotenv/config";


const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

const ogm = new OGM({typeDefs, resolvers, driver});

const client = createClient();

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error(err);
  }
})();

const app = express();

app.use(express.json());

app.use("/api", router);

const port = process.env.PORT;

ogm.init().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});