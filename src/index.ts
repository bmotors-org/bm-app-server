import {ApolloServer} from "apollo-server"
import {Neo4jGraphQL} from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import {typeDefs} from "./typeDefs"
import {resolvers} from "./resolvers"
import "dotenv/config";

const driver = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(
        process.env.NEO4J_USER!,
        process.env.NEO4J_PASSWORD!
    )
);

const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    resolvers
});

neoSchema.getSchema().then(schema => {
    const server = new ApolloServer({
        schema,
        introspection: true,
    });

    server.listen().then(({url}) => {
        console.log(`Server ready at ${url}`);
    });
});

