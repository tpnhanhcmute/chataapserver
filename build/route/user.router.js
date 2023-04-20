"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const userRoutes = (app) => {
    app.post('/user/register', user_controller_1.default.register);
    app.post('/user/login', user_controller_1.default.login);
};
exports.default = userRoutes;
//# sourceMappingURL=user.router.js.map