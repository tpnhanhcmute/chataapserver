import { Request, Response} from "express";
import { User } from "../model/user.model";
import {database} from "../service/firebase.service"
import utils from "../utils/utils";
import emailService from "../service/email.service"
import * as nodemailer from 'nodemailer';

const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const newUser = req.body as User
        const password = newUser.password
        let isExitedAcount:Boolean = false
        let userID:String =""
        newUser.isAuth= false
        newUser.password = await utils.hashMessage(newUser.password.toString())

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
                userName: newUser.name,
                email:newUser.email,
                password:password
            },
            otp: otp
            }
        })
    }catch(error){
    res.status(404).send({
        isError: true,
        message:error
    })
   }
}
export default {register}