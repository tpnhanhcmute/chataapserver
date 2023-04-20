"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = exports.database = exports.realtimedb = void 0;
const admin = __importStar(require("firebase-admin"));
const serviceAccount = __importStar(require("../config/firebase_service_accout_key.json"));
require("firebase/firestore");
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatapp-319f6-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "gs://chatapp-319f6.appspot.com/"
});
const realtimedb = admin.database();
exports.realtimedb = realtimedb;
const database = admin.firestore();
exports.database = database;
const bucket = admin.storage().bucket();
exports.bucket = bucket;
//# sourceMappingURL=firebase.service.js.map