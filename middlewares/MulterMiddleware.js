// import multer from "multer";


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "../uploads")
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.originalname + '-' + uniqueSuffix)
//     }
// })

// export const upload = multer({ storage: storage })

import multer from "multer";
import path from "path";

// Define the destination directory for file uploads
const destinationDirectory = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destinationDirectory);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix);
    }
});

export const upload = multer({ storage: storage });
