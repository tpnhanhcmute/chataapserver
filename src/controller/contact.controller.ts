import { Request, Response } from "express";
import { realtimedb, database } from "../service/firebase.service";
import { RequestContact } from "../model/contact.request";
import { Contact } from "../model/contact.model";
import { Message } from "../model/message.model";
import { User } from "../model/user.model";
import { SearchRequest } from "../model/search.request";
import { Search } from "../model/search";
import { SearchResponse } from "../model/search.response";
import { MapPhoneNumberRequest } from "../model/mapPhoneNumberRequest";

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

     
        contactList.forEach(x=>{
            const user = userDis[x.userID] as User
            x.avatarUrl = user.avatarUrl
            x.name = user.name
        })

        res.status(200).send({
            isError:false,
            message:"data",
            data:{
                listContactUser: contactList
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

const search =async (req: Request, res: Response) : Promise<void> =>{
    const searchRequest =req.body as SearchRequest

    try{
        const userRefEmail = database.collection("user").where("email", "==", searchRequest.query)
        const userRefPhoneNumber =  database.collection("user").where("phoneNumber", "==", searchRequest.query)
        
        const [userDocsEmail, userDocPhoneNumber] =
        await Promise.all([userRefEmail.get(),userRefPhoneNumber.get()])

        let listSearch = []

        if(!userDocsEmail.empty){
            userDocsEmail.docs.forEach(x=>{
                const user = x.data() as User
                let search = {} as Search
                search.avatarUrl = user.avatarUrl
                search.email= user.email
                search.name= user.name,
                search.phoneNumber = user.phoneNumber
                search.userID =x.id

                listSearch.push(search)
            })
        }else{
            if(!userDocPhoneNumber.empty){
                userDocPhoneNumber.docs.forEach(x=>{
                    const user = x.data() as User
                    let search = {} as Search
                    search.avatarUrl = user.avatarUrl
                    search.email= user.email
                    search.name= user.name,
                    search.phoneNumber = user.phoneNumber
                    search.userID =x.id
    
                    listSearch.push(search)
                })
            }
        }
        let searchResponse = {} as SearchResponse
        searchResponse.listSearch = listSearch

        res.status(200).send({
            isError:false,
            message:"user information",
            data: searchResponse
        })

    }catch(error){
        res.status(200).send({
            isError:true,
            message:error
        })
    }
}

const mapPhoneNumber = async (req:Request, res: Response) :Promise<void>=>{
    const mapPhoneNumberReqeust = req.body as MapPhoneNumberRequest
    try{

        const filterSplit = []
        const size = 30
        for(let i =0;i< mapPhoneNumberReqeust.phoneNumberList.length;i+=size){
            const chunk = mapPhoneNumberReqeust.phoneNumberList.slice(i, i + size) as Array<string>
            filterSplit.push(chunk)
        }

        const userDocs  = []
        let userSnapshots = []

        filterSplit.forEach(x=>{
            const userRef = database.collection("user").where('phoneNumber', "in",x as Array<string>)

            userDocs.push( async function(userSnapshots) {
                const userDoc = await userRef.get();
                console.log(userDoc.docs.length);
                userSnapshots.push(userDoc.docs)
                
            })
        })

        await Promise.all(userDocs.map((fn) => fn(userSnapshots)))

        const response = {} as any
        userSnapshots.forEach(userSnapshot=>{
            userSnapshot.forEach(x=>{
                const user = x.data() as User
                const search = {} as Search
                search.userID = x.id
                search.avatarUrl =user.avatarUrl
                search.email = user.email
                search.phoneNumber = user.phoneNumber 
                search.name = user.name

                response[user.phoneNumber] = search
            })
        })
        res.status(200).send({
            isError:false,
            message:"Mapping phoneNumber",
            data: {
                "mapPhoneNumber":response
            }
        })

        
    }catch(error){
        res.status(200).send({
            isError:true,
            message: JSON.stringify(error)
        })
    }
}
export default {
    getContacts, search,mapPhoneNumber
}