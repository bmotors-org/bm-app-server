import {QueryResult} from "neo4j-driver"
import {neo4jSession} from "../index"

export function createCustomer(phoneNumber: string): Promise<QueryResult> {
  return neo4jSession.run(
    "MERGE (c:Customer {phone: $phoneNumber}) RETURN c",
    {phoneNumber}
  )
}

