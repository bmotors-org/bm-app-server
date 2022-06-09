import {neo4jDriver} from "../index"

const session = neo4jDriver.session()

export async function createCustomer(phoneNumber) {
  try {
    const result = await session.run(
      "MERGE (c:Customer {phone: $phoneNumber}) RETURN c",
      {phoneNumber}
    )
    console.log("result:", result)
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    console.log("node property name", node.properties.name)
  } finally {
    await session.close()
  }
}

