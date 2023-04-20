import imageController from "../controller/image.controller"
import { Application, Response } from 'express';

import multer from 'multer';
const upload = multer({
    storage: multer.memoryStorage()
  })
const imageRoutes =  (app: Application): void => {
    app.post('/image/upload',upload.single('file'), imageController.upload);
  };
export default imageRoutes;