import { Request, Response} from "express";
import { RequestOTP } from "../model/otp.request.model";
import utils from "../utils/utils";
import emailService from "../service/email.service"
import { AuthenticationOTPRequest } from "../model/authenticateOtp.request.model";
import {database} from "../service/firebase.service"

const resendOtp =async (req: Request, res: Response): Promise<void> =>{
    try{
        const requestOTP = req.body as RequestOTP
        console.log(requestOTP)
        const otp = utils.randomNumber(4)
        await emailService.sendEmail(requestOTP.email.toString(),"Authenticate chat app registration", "Resend OTP \n Your otp: "+ otp.toString())

        res.status(200).send({
            isError:false,
            message:"Resend otp successful",
            data:{
                otp:otp.toString()
            }
        })
    }catch(error){
        res.status(404).send({
            isError:true,
            message:error
        })
    }
}
const authenticateOtp = async (req:Request, res: Response):Promise<void>=>{
   try{
        const autheticateOTP = req.body as AuthenticationOTPRequest
        const userDoc = database.collection('user').doc(autheticateOTP.userID.toString())   
        await userDoc.update({
            "isAuth":true
        })

        res.status(200).send({
            isError:false,
            message:"Authenticate successful",
        })
   }catch(error){
    res.status(404).send({
        isError:true,
        message:"Authenticate false. Please retry"
    })
   }
}
export default {resendOtp, authenticateOtp}