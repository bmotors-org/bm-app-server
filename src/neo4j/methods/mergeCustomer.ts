import {neo4jSession} from "../index"

type UserData = {
  name: string,
  email: string
}

export async function mergeCustomer(phoneNumber: string): Promise<UserData> {
  const customer = await neo4jSession.run(
    `
    MERGE (c:Customer {phoneNumber: $phoneNumber})
    RETURN c
    `, {
      phoneNumber: phoneNumber
    }
  )
  console.log("Created customer:", customer.records[0].get(0))
  console.log("Query summary:", customer.summary.counters, customer.summary.updateStatistics)

  const userData: UserData = {name: "", email: ""}

  userData.name = customer.records[0].get(0).properties.name || ""
  userData.email = customer.records[0].get(0).properties.email || ""

  return userData
}

