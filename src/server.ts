import http from "http"
import {ApolloServer} from "apollo-server-express"
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core"
import {app} from "./app/app"
import {resolvers} from "./neo4j/graphql/resolvers"
import {neoSchema} from "./neo4j/graphql/schema"
import {keys} from "./keys"

const httpServer = http.createServer(app)

const port = keys.port

neoSchema.getSchema().then(async (schema) => {
  const server = new ApolloServer({
    schema,
    resolvers,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
  })

  await server.start()
  server.applyMiddleware({app, path: "/graphql", cors: true})
  await new Promise<void>(resolve => httpServer.listen({port}, resolve))
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
})