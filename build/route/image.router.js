"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_controller_1 = __importDefault(require("../controller/image.controller"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage()
});
const imageRoutes = (app) => {
    app.post('/image/upload', upload.single('file'), image_controller_1.default.upload);
};
exports.default = imageRoutes;
//# sourceMappingURL=image.router.js.map