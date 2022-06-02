type service_feeT = {
    rent_price: number
}

export const resolvers = {
    Order: {
        async status() {
            return "PENDING"
        }
    },

    resolved_by: {
        async service_fee(source: service_feeT) {
            return source.rent_price * 0.1
        }
    }
}