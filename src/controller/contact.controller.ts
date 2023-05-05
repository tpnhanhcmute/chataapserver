import { Request, Response } from "express";
import { realtimedb, database } from "../service/firebase.service";
import { RequestContact } from "../model/contact.request";
import { Contact } from "../model/contact.model";
import { Message } from "../model/message.model";
import { User } from "../model/user.model";

const getContacts = async (req:Request, res:Response):Promise<void> =>{
    let getContactsRequest = req.body as RequestContact
    try{
        let contactList = [] as Array<Contact>

        let data = []

        const [snapshot,userRef] = await Promise.all([ await realtimedb.ref(`message/${getContactsRequest.userID}`).once("value"),
                database.collection("user").get()])

        snapshot.forEach(childSnapshot =>{
            const valuesArray = Object.values(childSnapshot.val()); // Convert object values to an array
            const lastValue = valuesArray[valuesArray.length - 1] as Message

            let contact = {} as Contact
            contact.lastMessage = lastValue.content
            contact.date = lastValue.date
            contact.messageID = childSnapshot.key
            contact.userID = childSnapshot.key
            
            contactList.push(contact)
        })
        
        const userDis = {} as any
        const userDocs = userRef.docs.forEach(doc=>{
            userDis[doc.id] = doc.data() as User
        })

        let contactPresponse = [] as Array<Contact>
        contactList.forEach(x=>{
            const user = userDis[x.userID] as User
            const contact = {} as Contact
            contact.userID = x.userID
            contact.messageID = x.messageID
            contact.date =x.date
            contact.lastMessage = x.lastMessage
            contact.avatarUrl = user.avatarUrl
            contact.name = user.name
            contactPresponse.push(contact)

        })

        res.status(200).send({
            isError:false,
            message:"data",
            data:{
                listContactUser: contactPresponse
            }
        })
        
    }
    catch(error){
        res.status(200).send({
            isError:true,
            message:error
        })
    }

}
export default {
    getContacts
}