import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/firebase_service_accout_key.json';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getFirestore } from 'firebase-admin/firestore';

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://chatapp-319f6-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
const realtimedb = admin.database()
const database = getFirestore(app)

export {realtimedb, database}