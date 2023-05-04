import { Message } from "./message.model"

export interface MessageRequest{
    senderID:string
    receiverID:string
    message:Message
}