import neo4j from "neo4j-driver"
import {keys} from "../keys"
import {errDetails} from "../error/errDetails";

export const neo4jDriver = neo4j.driver(
  keys.neo4j.uri,
  neo4j.auth.basic(
    keys.neo4j.user,
    keys.neo4j.password,
  ),
  {
    maxConnectionPoolSize: 100,
    connectionTimeout: 5000, // 5 seconds
    logging: {
      level: 'info',
      logger: (level, message) => console.log(level + ' ' + message)
    },
  }
)

try {
  await neo4jDriver.verifyConnectivity()
} catch (err) {
  console.error(errDetails(err))
}

export const neo4jSession = neo4jDriver.session()