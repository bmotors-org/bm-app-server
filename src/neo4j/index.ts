import neo4j from "neo4j-driver"
import {keys} from "../keys"

export const neo4jDriver = neo4j.driver(
  keys.neo4j.uri,
  neo4j.auth.basic(
    keys.neo4j.user,
    keys.neo4j.password,
  )
)

export const neo4jSession = neo4jDriver.session()