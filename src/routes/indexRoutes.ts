import * as express from "express";
const path = require("path");
const app = express.Router();
import {mainController} from '../controllers/mainController';
const multer = require('multer');
console.log();

const dest = multer.diskStorage({
    destination: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        cb(null, path.resolve(__dirname,"../data"))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
})
const upload = multer({storage:dest});

app.get('/', mainController.index);

app.get('/convert', mainController.toConvertList);
app.get('/list', mainController.jsonList);
app.get('/listByCom', mainController.comList);

app.get('/convert/:id', mainController.convertThis);
app.get('/view/:id', mainController.jsonDetail);



app.post('/new', [upload.single('upload')], mainController.uploadTable);
app.post('/com/:id', mainController.assignCom);
app.post('/delcom/:id', mainController.unassignCom);

app.post('/roulette/:id', mainController.roulette);








export {app as indexRoutes}