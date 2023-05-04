import messageController from "../controller/message.controller"
import { Application, Response } from 'express';

const messageRoutes =  (app: Application): void => {
    app.post('/message/sendMessage', messageController.sendMessage);
    app.post('/message/recallMessage', messageController.recallMessage);
   
  };
export default messageRoutes;