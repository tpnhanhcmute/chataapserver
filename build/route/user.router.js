"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_controller_1 = __importDefault(require("../controller/user.controller"));
var userRoutes = function (app) {
    app.post('/user/register', user_controller_1.default.register);
};
exports.default = userRoutes;
