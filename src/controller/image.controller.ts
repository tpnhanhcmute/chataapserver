import { Request, Response} from "express";
import {bucket} from "../service/firebase.service"
import multer from 'multer';
const upload = async (req:Request,res:Response):Promise<void> =>{
  try{
        const file = req.file
        if(!file) throw "No files found"

        const fileName = Date.now() + '_' + file.originalname;
        const options = {
            destination: 'images/' + fileName,
            metadata: {
              contentType: file.mimetype
            }
          };
          
        const [uploadedFile] = await bucket.upload(file.buffer.toString(), options);
        const [url] = await uploadedFile.getSignedUrl({ action: 'read', expires: '03-17-2025' });
        res.status(200).send({
            isError:false,
            message:"Upload image successfull",
            data:{
                url: url
            }
        })

  }catch(error){
        res.status(500).send({
            isError:true,
            message:error
        })
  }
    
}
export default { upload}