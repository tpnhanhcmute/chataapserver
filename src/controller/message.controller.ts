import { Request, Response} from "express";
import { MessageRequest } from "../model/message.request.model";
import { database,realtimedb,message} from "../service/firebase.service";
import { RecallMessageRequest } from "../model/recallMessage.request";
import { User } from "../model/user.model";

const sendMessage = async (req:Request, res:Response): Promise<void> =>{
    const messageRequest = req.body as MessageRequest

    const curentDate = new Date()
    const dateString = curentDate.toLocaleString()

    messageRequest.message.senderID = messageRequest.senderID
    messageRequest.message.isRecall = false
    messageRequest.message.date = dateString
    
    try{
        const messageSenderRef =  realtimedb.ref(`message/${messageRequest.senderID}/${messageRequest.receiverID}`)
        const messageReciverRef = realtimedb.ref(`message/${messageRequest.receiverID}/${messageRequest.senderID}`)

        const newMessageSenderRef = messageSenderRef.push()
        const newMessageReciverRef = messageReciverRef.child(newMessageSenderRef.key)

        await Promise.all([newMessageSenderRef.set(messageRequest.message),
            newMessageReciverRef.set(messageRequest.message)])
          
        res.status(200).send({
            isError:false,
            message:"Send message sucessfully"
        })    

       
        let registerDeviceToken = []
      
        let [senderRef, receiverRef ] = await Promise.all([ database.collection("user").doc(messageRequest.senderID).get(),
        database.collection("user").doc(messageRequest.receiverID).get()])

        if(receiverRef.exists){
            const user = receiverRef.data() as User
            registerDeviceToken = user.deviceToken
            
        }
        let senderName = ""
        if(senderRef.exists){
            const user = senderRef.data() as User
            senderName = user.name
        }
       if(registerDeviceToken){
            message.sendMulticast(
                {
                    tokens: registerDeviceToken,
                    notification:{
                        title:"Chatapp.com",
                        body:`Notification message from ${senderName}`
                    }
                }
            );
       }
    }
    catch(error){
        res.status(200).send({
            isError:true,
            message: error.toString()
        })
    }
}

const recallMessage = async (req: Request, res:Response) :Promise<void> =>{
    const recallMessageRequest = req.body as RecallMessageRequest

    try{
        const messageSenderRef =  realtimedb.ref(`message/${recallMessageRequest.senderID}/${recallMessageRequest.receiverID}/${recallMessageRequest.messageID}`)
        const messageReceiverRef = realtimedb.ref(`message/${recallMessageRequest.receiverID}/${recallMessageRequest.senderID}/${recallMessageRequest.messageID}`)

        const data = (await messageSenderRef.get()).val
        const funcArr = []
        const removeMessageSenderFunc = async (messageSenderRef) =>{
            await messageSenderRef.update({"isRecall":true})
        }
        funcArr.push(removeMessageSenderFunc(messageSenderRef))

        if(recallMessageRequest.isRecallAll){
            const removeMessageReceiverFunc = async (messageReceiverRef) =>{
                await messageReceiverRef.update({"isRecall":true})
            }
            funcArr.push(removeMessageReceiverFunc(messageReceiverRef))
        }
        await Promise.all(funcArr)
        
        res.status(200).send({
            isError:false,
            message:"Recall successfully"
        })

    }catch(error){
        res.status(200).send({
            isError:true,
            message: error.toString()
        })
    }
}
export default {
    sendMessage,
    recallMessage
}