import contactController from "../controller/contact.controller"
import { Application, Response } from 'express';

const contactRoutes =  (app: Application): void => {
    app.post('/contact/getContacts', contactController.getContacts);   
    app.post('/contact/search', contactController.search)
    app.post('/contact/mapPhoneNumber', contactController.mapPhoneNumber)
  };
export default contactRoutes;