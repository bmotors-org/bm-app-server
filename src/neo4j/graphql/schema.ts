import {Neo4jGraphQL} from "@neo4j/graphql"
import {typeDefs} from "./typeDefs"
import {neo4jDriver} from "../index"

export const neoSchema = new Neo4jGraphQL({typeDefs, driver: neo4jDriver})
