"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils/utils"));
const email_service_1 = __importDefault(require("../service/email.service"));
const firebase_service_1 = require("../service/firebase.service");
const resendOtp = async (req, res) => {
    try {
        const requestOTP = req.body;
        console.log(requestOTP);
        const otp = utils_1.default.randomNumber(4);
        await email_service_1.default.sendEmail(requestOTP.email.toString(), "Authenticate chat app registration", "Resend OTP \n Your otp: " + otp.toString());
        res.status(200).send({
            isError: false,
            message: "Resend otp successful",
            data: {
                otp: otp.toString()
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
const authenticateOtp = async (req, res) => {
    try {
        const autheticateOTP = req.body;
        const userDoc = firebase_service_1.database.collection('user').doc(autheticateOTP.userID.toString());
        await userDoc.update({
            "isAuth": true
        });
        res.status(200).send({
            isError: false,
            message: "Authenticate successful",
        });
    }
    catch (error) {
        res.status(404).send({
            isError: true,
            message: "Authenticate false. Please retry"
        });
    }
};
exports.default = { resendOtp, authenticateOtp };
//# sourceMappingURL=authenticate.controller.js.map