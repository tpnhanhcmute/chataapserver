import userController from "../controller/user.controller"
import { Application, Response } from 'express';

const userRoutes =  (app: Application): void => {
    app.post('/user/register', userController.register);
    app.post('/user/login', userController.login)
    app.post('/user/update', userController.update)
    app.post('/user/logout', userController.logout)
  };
export default userRoutes;