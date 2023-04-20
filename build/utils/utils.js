"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const randomNumber = function randomNumber(length) {
    let numberRandom = "";
    for (let i = 0; i < length; i++) {
        let per = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        numberRandom += per.toString();
    }
    return numberRandom;
};
const hashMessage = async function hashMessage(message) {
    const hash = crypto_1.default.createHash('sha256');
    hash.update(message.toString());
    const hashedMessage = hash.digest('hex');
    return hashedMessage;
};
exports.default = { randomNumber, hashMessage };
//# sourceMappingURL=utils.js.map