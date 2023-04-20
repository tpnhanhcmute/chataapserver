import commonController from "../controller/authenticate.controller"
import { Application, Response } from 'express';

const commonRoutes =  (app: Application): void => {
    app.post('/common/resendOtp', commonController.resendOtp);
    app.post('/common/authenticateOtp',commonController.authenticateOtp)
  };
export default commonRoutes;