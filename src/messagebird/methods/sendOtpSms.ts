import {MessageBird} from "messagebird"

export async function sendOtpSms(
  mbClient: MessageBird,
  phoneNumber: string,
  val: string
) {
  return await new Promise((resolve, reject) => {
    mbClient.messages.create({
      originator: "TestMessage",
      recipients: [`+8801554355868`],
      body: "Your OTP is " + val
    }, (err, response) => {
      if (err) reject(err)
      else {
        console.log(response)
        resolve(response)
      }
    })
  })
}