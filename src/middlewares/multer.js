// utils/multerConfig.js
import multer from "multer";
import path from "path";

import { __dirname } from "../utils/utils.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = file.fieldname === "document" ? "documents" : "profiles";
        cb(null, path.join(__dirname, "..", "public", "img", folder));
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

export const uploader = multer({ storage: storage });
