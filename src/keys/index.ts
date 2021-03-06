import "dotenv/config"

export const keys = {
  // Neo4j
  neo4j: {
    uri: process.env.NEO4J_URI!,
    user: process.env.NEO4J_USER!,
    password: process.env.NEO4J_PASSWORD!,
  },
  // MessageBird
  messagebird: {
    testAccessKey: process.env.MESSAGEBIRD_TEST_ACCESS_KEY!,
    liveAccessKey: process.env.MESSAGEBIRD_LIVE_ACCESS_KEY!,
  },

  privateKey: {
    key: process.env.PRIVATE_KEY!,
    passphrase: process.env.PRIVATE_KEY_PASSPHRASE!,
  },
  // Port
  port: process.env.PORT!,
}