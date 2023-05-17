import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/firebase_service_accout_key.json';
import 'firebase/firestore';
import * as dotenv from "dotenv";

dotenv.config();
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.DATABASEURL as string,
    storageBucket: process.env.STORAGE as string
  });
const realtimedb = admin.database()
const database = admin.firestore()
const bucket = admin.storage().bucket()
const message = admin.messaging()
export {realtimedb, database, bucket , message}