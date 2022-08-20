"use strict";
exports.__esModule = true;
exports.mainController = void 0;
//import { shuffle, processBody, allToJson, allProcess, allParser /* groupFinder */ } from "../models/mainModel"
var mainModel_1 = require("../models/mainModel");
var mainController = {
    index: function (req, res) {
        var src = req.src; // Guardo mi entorno en una variable que esté al alcance
        var data = [];
        var nuevo = mainModel_1.model.allToJson(src); // Convierto los datos a un array de objetos (le paso el entorno porque de ahí es donde el modelo sabe de que formato debe convertir)
        var soloNombres = mainModel_1.model.allProcess(nuevo, src.column, src.ext); // Proceso los objetos para que solo contengan el nombre y para arreglar otros inconvenientes
        data = mainModel_1.model.allParser(soloNombres, src.ext); // Les doy a esos objetos el formato que necesito usar
        return res.render("home", { data: data }); // Renderizo el formulario inicial con el array ya procesado
    },
    secondRoulette: function (req, res) {
        var data = mainModel_1.model.processBody(req.body, req.src); // Recibo el dato de los participantes de la ruleta y los guardo
        data = mainModel_1.model.shuffle(data); // Los mezclo
        return res.render("roulette", { myData: data }); // Y renderizo la ruleta, la cual posee otra función que da aleatoriedad al listado
    },
    groupsIndex: function (req, res) {
        var groups;
        //req.src.origin == "Google" ? groups = model.groupFinder(req.src) : res.send("Esta función solo está habilitada para los .csv importados desde la rúbrica de Google Spreadsheets")
    }
};
exports.mainController = mainController;
//# sourceMappingURL=mainController.js.map