import {Balance, MessageBird} from "messagebird"

export function readBalance(mbClient: MessageBird): Promise<Balance | Error> {
  return new Promise((resolve, reject) => {
    mbClient.balance.read((err, balance) => {
      if (err) {
        reject(err)
      } else {
        resolve(balance!)
      }
    })
  })
}