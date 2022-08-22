"use strict";
exports.__esModule = true;
exports.indexRoutes = void 0;
var express = require("express");
var path = require("path");
var app = express.Router();
exports.indexRoutes = app;
var mainController_1 = require("../controllers/mainController");
var multer = require('multer');
console.log();
var dest = multer.diskStorage({
    destination: function (req, file, cb) {
        var extension = path.extname(file.originalname);
        cb(null, path.resolve(__dirname, "../data"));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage: dest });
app.get('/', mainController_1.mainController.index);
app.get('/convert', mainController_1.mainController.toConvertList);
app.post('/new', [upload.single('upload')], mainController_1.mainController.uploadTable);
app.get('/convert/:id', mainController_1.mainController.convertThis);
app.get('/list', mainController_1.mainController.jsonList);
app.get('/view/:id', mainController_1.mainController.jsonDetail);
app.post('/com/:id', mainController_1.mainController.assignCom);
app.post('/delcom/:id', mainController_1.mainController.unassignCom);
app.post('/roulette', mainController_1.mainController.roulette);
app.get('/listByCom', mainController_1.mainController.comList);
//# sourceMappingURL=indexRoutes.js.map