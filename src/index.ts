import express from "express";
import {ApolloServer} from "apollo-server-express";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import neo4j from "neo4j-driver";
import {createClient} from "redis";
import {typeDefs} from "./typeDefs";
import {resolvers} from "./resolvers";
import {router} from "./routes";
import "dotenv/config";
import http from "http";
import {Neo4jGraphQL} from "@neo4j/graphql";

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

const neoSchema = new Neo4jGraphQL({typeDefs, driver});

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

app.use(express.json())
  .use("/api", router);

const httpServer = http.createServer(app);

const port = process.env.PORT;

neoSchema.getSchema().then(async (schema) => {
  const server = new ApolloServer({
    schema,
    resolvers,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
  });

  await server.start();
  server.applyMiddleware({app, path: "/graphql"});
  await new Promise<void>(resolve => httpServer.listen({port}, resolve));
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
});




