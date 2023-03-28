var multer = require('multer');
const path = require('path');
var fs = require('fs');

var dir = path.join(__dirname, '../..', '/public/uploads/foods') ;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}


const destPath = path.join(__dirname, '../..', '/public/uploads/foods')


const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error('Plese upload only images'), false);
    }
}



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destPath)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-image-${file.originalname}`)
    }
});

const fileLimit = 0.5 * 1000000; // 500kB

module.exports = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: fileLimit }
})