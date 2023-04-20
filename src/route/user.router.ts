import userController from "../controller/user.controller"
import { Application, Response } from 'express';

const userRoutes =  (app: Application): void => {
    app.post('/user/register', userController.register);
    app.post('/user/login', userController.login)
  };
export default userRoutes;