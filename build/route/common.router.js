"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authenticate_controller_1 = __importDefault(require("../controller/authenticate.controller"));
var commonRoutes = function (app) {
    app.post('/common/resendOtp', authenticate_controller_1.default.resendOtp);
    app.post('/common/authenticateOtp', authenticate_controller_1.default.authenticateOtp);
};
exports.default = commonRoutes;
