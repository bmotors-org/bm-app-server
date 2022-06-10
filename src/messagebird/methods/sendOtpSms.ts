import {Message, MessageBird} from "messagebird"
import {promisify} from "util"

export function sendOtpSms(
  mbClient: MessageBird,
  phoneNumber: string,
  val: string
): Promise<Message | null> {
  return promisify(mbClient.messages.create)({
    originator: "TestMessage",
    recipients: [`+8801934400089`],
    body: "Your OTP is " + val
  })
}