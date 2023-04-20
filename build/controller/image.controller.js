"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_service_1 = require("../service/firebase.service");
const upload = async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            throw "No files found";
        const fileName = Date.now() + '_' + file.originalname;
        const options = {
            destination: 'images/' + fileName,
            metadata: {
                contentType: file.mimetype
            }
        };
        const [uploadedFile] = await firebase_service_1.bucket.upload(file.buffer.toString(), options);
        const [url] = await uploadedFile.getSignedUrl({ action: 'read', expires: '03-17-2025' });
        res.status(200).send({
            isError: false,
            message: "Upload image successfull",
            data: {
                url: url
            }
        });
    }
    catch (error) {
        res.status(500).send({
            isError: true,
            message: error
        });
    }
};
exports.default = { upload };
//# sourceMappingURL=image.controller.js.map