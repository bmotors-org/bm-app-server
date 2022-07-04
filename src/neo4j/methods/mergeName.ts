import {neo4jSession} from "../index"
import {errDetails} from "../../error/errDetails";

export async function mergeName(name: string, phoneNumber: string) {
  try {
    const customer = await neo4jSession.writeTransaction(tx => {
      return tx.run(
        `
    MATCH (c:Customer {phoneNumber: $phoneNumber})
    SET c.name = $name
    RETURN c`,
        {
          phoneNumber: phoneNumber,
          name: name,
        }
      )
    })
    console.log("Query summary:", customer.summary.counters, customer.summary.updateStatistics)
  } catch (e) {
    console.error(errDetails(e))
  }
}


