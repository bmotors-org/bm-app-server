import initMb from "messagebird"
import {keys} from "../keys"

export const mbClient = initMb(keys.messagebird.testAccessKey)