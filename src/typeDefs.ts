export const typeDefs = `
    type Customer {
        id: ID! @id
        name: String!
        email: String!
        phone: String!
        savedAddresses: [String!]!
        address: String!
        orders: [Order!]! @relationship(type: "CREATED", direction: OUT, properties: "created")
        createdAt: DateTime! @timestamp(operations: [CREATE])
        updatedAt: DateTime! @timestamp(operations: [UPDATE])
    }

    type Order {
        id: ID! @id
        loadLocation: String!
        unloadLocation: String!
        instructions: String!
        status: String! @computed
        resolvedBy: VehicleOwner! @relationship(type: "RESOLVED_BY", direction: OUT, properties: "resolved_by")
        createdAt: DateTime! @timestamp(operations: [CREATE])
        updatedAt: DateTime! @timestamp(operations: [UPDATE])
    }

    type VehicleOwner {
        id: ID!
        name: String!
        email: String!
        phone: String!
        address: String!
        createdAt: DateTime! @timestamp(operations: [CREATE])
        updatedAt: DateTime! @timestamp(operations: [UPDATE])
    }

    interface created @relationshipProperties {
        id: ID! @id
        createdAt: DateTime! @timestamp(operations: [CREATE])
        updatedAt: DateTime! @timestamp(operations: [UPDATE])
    }

    interface resolved_by @relationshipProperties {
        id: ID! @id
        rent_price: Int!
        service_fee: Int! @computed(from: ["rent_price"])
        createdAt: DateTime! @timestamp(operations: [CREATE])
        updatedAt: DateTime! @timestamp(operations: [UPDATE])
    }
    
    type AuthFunctions {
        authorize(phone: String!): String!
    }
`;

