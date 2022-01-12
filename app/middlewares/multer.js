const multer = require('multer');

//set storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '../../../app/public/uploads')
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        console.log("+}_+_+_+__++_+_+_+_+_", file)
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
})

module.exports = store = multer({ storage: storage })