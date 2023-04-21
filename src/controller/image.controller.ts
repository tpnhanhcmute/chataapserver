import { Request, Response} from "express";
import {bucket} from "../service/firebase.service"
import multer from 'multer';
import * as path from 'path';
import * as dotenv from "dotenv";
import { database } from "../service/firebase.service"
import { Image } from "../model/image.model";

dotenv.config();
const upload = async (req:Request,res:Response):Promise<void> =>{
 try{
    const file = req.file;
    const {userID} = req.body
    console.log(req.body)
    if (!file) throw "No file uploaded."

    const filePath = "images/" + file.originalname;
    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    await new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        console.log(err);
        reject("Error uploading file.");
      });
      blobStream.on("finish", async () => {

        const signedUrls = await blob.getSignedUrl({
          action: "read",
          expires: "03-17-2025"
        });

        const publicUrl = signedUrls
        const  newImage = {} as Image
        newImage.userID = userID
        newImage.url = publicUrl.toString()

        await database.collection('image').add(newImage)

        res.status(200).send({
          isError:false,
          message:"Upload image successfull",
          data:{
            url:publicUrl
          }
        });
        resolve(resolve);
      });
      blobStream.end(file.buffer);
    });

  } catch (error) {
    res.status(500).send({
      isError:true,
      message: error
    });
  }
}
export default { upload}