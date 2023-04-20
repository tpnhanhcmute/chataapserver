import userController from "../controller/user.controller"
import { Application, Response } from 'express';

const userRoutes =  (app: Application): void => {
    app.post('/user/register', userController.register);
  };
export default userRoutes;