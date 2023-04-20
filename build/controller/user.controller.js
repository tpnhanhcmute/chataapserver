"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_service_1 = require("../service/firebase.service");
const utils_1 = __importDefault(require("../utils/utils"));
const email_service_1 = __importDefault(require("../service/email.service"));
const register = async (req, res) => {
    try {
        const newUser = req.body;
        const password = newUser.password;
        let isExitedAcount = false;
        let userID = "";
        newUser.isAuth = false;
        newUser.password = await utils_1.default.hashMessage(newUser.password);
        const userRef = firebase_service_1.database.collection("user");
        const thisUser = await userRef.where("email", "==", newUser.email).get();
        if (thisUser.size > 0) {
            userID = thisUser.docs[0].id;
            if (thisUser.docs[0].data().isAuth) {
                console.log(thisUser.docs[0].data().email);
                throw "Email is being used";
            }
            else {
                isExitedAcount = true;
                await userRef.doc(userID.toString()).update({
                    "password": newUser.password,
                    "name": newUser.name
                });
            }
        }
        console.log("UserID" + userID);
        const otp = utils_1.default.randomNumber(4);
        console.log(isExitedAcount);
        const AddUserFunc = async () => {
            console.log(isExitedAcount);
            if (!isExitedAcount) {
                const userDoc = await userRef.add(newUser);
                userID = userDoc.id;
            }
        };
        await Promise.all([AddUserFunc(),
            email_service_1.default.sendEmail(newUser.email.toString(), "Authenticate chat app registration", "Your otp: " + otp.toString())]);
        console.log(userID);
        res.status(200).send({
            isError: false,
            message: "Add new user success",
            data: {
                user: {
                    userID: userID,
                    userName: newUser.name,
                    email: newUser.email,
                    password: password
                },
                otp: otp
            }
        });
    }
    catch (error) {
        res.status(404).send({
            isError: true,
            message: error
        });
    }
};
const login = async (req, res) => {
    try {
        const loginRequest = req.body;
        const userDocs = await firebase_service_1.database.collection('user').where("email", "==", loginRequest.email).where("isAuth", "==", true).limit(1);
        const userInfos = await userDocs.get();
        if (userInfos.size == 0)
            throw "email not found";
        let userInfo = (userInfos.docs[0]).data();
        const hasPassword = await utils_1.default.hashMessage(loginRequest.password);
        if (hasPassword == userInfo.password) {
            userInfo.password = loginRequest.password;
            res.status(200).send({
                isError: false,
                message: "Login successfully",
                data: {
                    userID: userInfos.docs[0].id,
                    userName: userInfo.name,
                    email: userInfo.email,
                    password: userInfo.password
                }
            });
        }
        else {
            throw "Incorrect password";
        }
    }
    catch (error) {
        res.status(404).send({
            isError: true,
            message: error
        });
    }
};
exports.default = { register, login };
//# sourceMappingURL=user.controller.js.map