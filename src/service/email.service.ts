import * as nodemailer from 'nodemailer';
import * as dotenv from "dotenv";
dotenv.config();

const email = process.env.EMAIL
const password = process.env.PASSWORD
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

const sendEmail = async function senEmail( to:string,subject: string ,message:string): Promise<Boolean> {
    try{
        const messageInfo = await transporter.sendMail({
            to: to,
            subject: subject,
            text: message,
          })
          return true
          
    }catch(error){
        throw "Send otp failure"
    }
  }

export default {sendEmail}
  