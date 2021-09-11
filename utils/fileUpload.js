const multer = require("multer");
let fs = require('fs');

let file = {}
// function for upload file to local server
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let user_id = req.signedInUser;
        if (!fs.existsSync('public/uploads/' + user_id)) {
            fs.mkdirSync('public/uploads/' + user_id);
        }
        cb(null, 'public/uploads/' + user_id)
    },
    filename: (req, file, cb) => {
        regex = new RegExp('[^.]+$');
        extension = file.originalname.match(regex);
        onlyFileName = file.originalname.split('.' + extension[0]);
        file['filepath'] = onlyFileName[0] +
            Date.now() +
            '.' + extension[0];
        cb(null, file.filepath);
    }
});

var upload = multer({
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/gi)) {
            callback(null, false)
        } else {
            callback(null, true)
        }
    },
    storage: storage
});

file.upload = upload;
module.exports = file;

