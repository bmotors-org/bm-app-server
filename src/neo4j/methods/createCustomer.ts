import {QueryResult} from "neo4j-driver"
import {neo4jSession} from "../index"

export async function createCustomer(phoneNumber: string): Promise<QueryResult> {
  const customer = await neo4jSession.run(
    "MERGE (c:Customer {phone: $phoneNumber}) RETURN c",
    {phoneNumber}
  )
  console.log("Created customer:", customer.records[0].get(0))
  console.log("Query summary:", customer.summary.counters, customer.summary.updateStatistics)
  return customer
}

