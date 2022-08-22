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

app.get('/convert', mainController.convert);

app.get('/convert/:id', mainController.convertThis);

app.post('/new', [upload.single('upload')], mainController.new);

app.get('/list', mainController.jsonList);

app.get('/view/:id', mainController.view);

app.post('/com/:id', mainController.assignCom)
app.post('/delcom/:id', mainController.unassignCom)

app.post('/roulette', mainController.secondRoulette);


export {app as indexRoutes}