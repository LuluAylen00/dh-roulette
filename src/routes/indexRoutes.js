"use strict";
exports.__esModule = true;
exports.indexRoutes = void 0;
var express = require("express");
var app = express.Router();
exports.indexRoutes = app;
var mainController_1 = require("../controllers/mainController");
app.get('/', mainController_1.mainController.index);
app.get('/list/:comId', mainController_1.mainController.newList);
app.get('/list/', mainController_1.mainController.list);
app.post('/roulette', mainController_1.mainController.secondRoulette);
//# sourceMappingURL=indexRoutes.js.map