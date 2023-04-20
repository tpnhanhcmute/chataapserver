"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_service_1 = require("../service/firebase.service");
var utils_1 = __importDefault(require("../utils/utils"));
var email_service_1 = __importDefault(require("../service/email.service"));
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser_1, password, isExitedAcount_1, userID_1, _a, userRef_1, thisUser, otp, AddUserFunc, messagInfo, userInfo, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                newUser_1 = req.body;
                password = newUser_1.password;
                isExitedAcount_1 = false;
                userID_1 = "";
                newUser_1.isAuth = false;
                _a = newUser_1;
                return [4 /*yield*/, utils_1.default.hashMessage(newUser_1.password.toString())];
            case 1:
                _a.password = _b.sent();
                userRef_1 = firebase_service_1.database.collection("user");
                return [4 /*yield*/, userRef_1.where("email", "==", newUser_1.email).get()];
            case 2:
                thisUser = _b.sent();
                if (!(thisUser.size > 0)) return [3 /*break*/, 5];
                userID_1 = thisUser.docs[0].id;
                if (!thisUser.docs[0].data().isAuth) return [3 /*break*/, 3];
                console.log(thisUser.docs[0].data().email);
                throw "Email is being used";
            case 3:
                isExitedAcount_1 = true;
                return [4 /*yield*/, userRef_1.doc(userID_1.toString()).update({
                        "password": newUser_1.password,
                        "name": newUser_1.name
                    })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                otp = utils_1.default.randomNumber(4);
                AddUserFunc = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!!isExitedAcount_1) return [3 /*break*/, 2];
                                return [4 /*yield*/, userRef_1.add(newUser_1)];
                            case 1:
                                userID_1 = (_a.sent()).id;
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, Promise.all([AddUserFunc,
                        email_service_1.default.sendEmail(newUser_1.email.toString(), "Authenticate chat app registration", "Your otp: " + otp.toString())])];
            case 6:
                messagInfo = (_b.sent())[0];
                return [4 /*yield*/, userRef_1.doc(userID_1.toString()).get()];
            case 7:
                userInfo = (_b.sent()).data();
                res.status(200).send({
                    isError: false,
                    message: "Add new user success",
                    data: {
                        user: {
                            userID: userID_1,
                            userName: userInfo.name,
                            email: userInfo.email,
                            password: password
                        },
                        otp: otp
                    }
                });
                return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                res.status(404).send({
                    isError: true,
                    message: error_1
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.default = { register: register };
