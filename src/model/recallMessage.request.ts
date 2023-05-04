export interface RecallMessageRequest{
    senderID: string,
    receiverID:string,
    messageID:string,
    isRecallAll: boolean
}