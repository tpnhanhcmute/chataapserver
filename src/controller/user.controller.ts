import { Request, Response} from "express";
import { User } from "../model/user.model";
import {database} from "../service/firebase.service"
import utils from "../utils/utils";
import emailService from "../service/email.service"
import { LoginRequest } from "../model/login.request.model";
import { UpdateProfileRequest } from "../model/updateProfile.request.model";
import { LogoutRequest } from "../model/logout.request";

const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const newUser = req.body as User
        const password = newUser.password
        let isExitedAcount:Boolean = false
        let userID:String =""
        newUser.isAuth= false
        newUser.password = await utils.hashMessage(newUser.password)

        const userRef = database.collection("user")
        const thisUser = await userRef.where("email","==", newUser.email).get()
        if(thisUser.size>0){
            userID = thisUser.docs[0].id
            if((thisUser.docs[0].data() as User).isAuth){
                console.log((thisUser.docs[0].data() as User).email)
                throw "Email is being used"
            }else{ 
                isExitedAcount = true
                await userRef.doc(userID.toString()).update({
                    "password":newUser.password,
                    "name":newUser.name
                })
            }
        }
        console.log("UserID"+userID)
        const otp:String = utils.randomNumber(4)
        console.log(isExitedAcount)
        const AddUserFunc = async ()=>{
            console.log(isExitedAcount)
            if(!isExitedAcount)
             {
                const  userDoc = await userRef.add(newUser)
                userID =  userDoc.id
             }
        }
        await Promise.all([AddUserFunc(),
                        emailService.sendEmail(newUser.email.toString(),"Authenticate chat app registration", "Your otp: "+ otp.toString())])
        console.log(userID)
        res.status(200).send({
            isError:false,
            message:"Add new user success",
            data:{
            user:{
                userID: userID,
                name: newUser.name,
                email:newUser.email,
                password:password
            },
            otp: otp
            }
        })
    }catch(error){
    res.status(200).send({
        isError: true,
        message:error
    })
   }
}
const login = async (req:Request, res:Response):Promise<void> =>{
   try{
        const loginRequest  = req.body as LoginRequest
        const userDocs = await database.collection('user').where("email","==",loginRequest.email).where("isAuth","==",true).limit(1)
        const userInfos = await userDocs.get()
        if(userInfos.size == 0) throw "email not found"

        const userSnapshot = userInfos.docs.shift()
        const userID = userSnapshot.id
        let userInfo =userSnapshot.data() as User
        const hasPassword =await  utils.hashMessage(loginRequest.password)
        if(hasPassword==userInfo.password)
        {
            let deviceTokens = userInfo.deviceToken
            if(!deviceTokens)
                deviceTokens = []
           if(!deviceTokens.includes(loginRequest.deviceToken))
           {
            deviceTokens.push(loginRequest.deviceToken)
           }
            await database.collection("user").doc(userID).update({"deviceToken": deviceTokens})

            userInfo.password =  loginRequest.password
            res.status(200).send({
                isError:false,
                message:"Login successfully",
                data:{
                    userID: userID,
                    phoneNumber:userInfo.phoneNumber,
                    name: userInfo.name,
                    email:userInfo.email,
                    password:userInfo.password,
                }
            })
        }else{
            throw "Incorrect password"
        }
   }catch(error){
    res.status(200).send({
        isError:true,
        message:error
    })
   }
}

const logout = async (req:Request, res: Response):Promise<void>=>{
    const logoutRequest = req.body as LogoutRequest
    try{
        const userRef =  database.collection("user").doc(logoutRequest.userID)
        const userSnapshot =await userRef.get()
        let deviceTokens = (userSnapshot.data() as User).deviceToken

        deviceTokens = deviceTokens.filter( x => !x.includes(logoutRequest.deviceToken))

        await userRef.update({"deviceToken": deviceTokens})
        res.status(200).send({
            isError:false,
            message:"Logout successfully"
        })

    }catch(error){
        res.status(200).send({
            isError:true,
            message:error
        })
    }
}

const update = async (req:Request, res: Response): Promise<void>=>{
    try{
        const newInfo = req.body as UpdateProfileRequest
        let objectUpdate={} as any
        if(newInfo.avatarUrl) objectUpdate["avatarUrl"] = newInfo.avatarUrl
        if(newInfo.name) objectUpdate["name"]= newInfo.name
        if(newInfo.phoneNumber) objectUpdate["phoneNumber"] = newInfo.phoneNumber

        const userDoc = await database.collection('user').doc(newInfo.userID.toString()).update(
            objectUpdate
        )
        res.status(200).send({
            isError:false,
            message:"Update profile successful"
        })
    }catch(error){
        res.status(200).send({
            isError:true,
            message:error
        })
    }
}
export default {register, login, update, logout}