const multer = require('multer');

//set storage
let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb){
        let ext = file.originalname.sub
    }
})