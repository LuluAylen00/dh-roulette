"use strict";
exports.__esModule = true;
exports.mainController = void 0;
var mainModel_1 = require("../models/mainModel");
var mainController = {
    index: function (req, res) {
        res.render('homepage');
    },
    toConvertList: function (req, res) {
        var files = mainModel_1.model.fileLister();
        res.render('toConvert', { files: files });
    },
    uploadTable: function (req, res) {
        console.log("Fichero", req.file.filename, "subido");
        res.redirect('/convert');
    },
    convertThis: function (req, res) {
        var id = req.params.id;
        var thisOne = mainModel_1.model.saveJson(id);
        res.redirect('/list');
    },
    jsonList: function (req, res) {
        var json = mainModel_1.model.jsonLister();
        if (json.length > 0) {
            res.render('jsonList', { data: json });
        }
        else {
            res.send("No hay documentos JSON");
        }
    },
    jsonDetail: function (req, res) {
        var data = mainModel_1.model.readJson(req.params.id);
        return res.render("takeList", { data: data });
    },
    assignCom: function (req, res) {
        var data = mainModel_1.model.readJson(req.params.id);
        var edit = mainModel_1.model.assignCom(req.params.id, req.body.adjust);
        return res.redirect('/view/' + req.params.id);
    },
    unassignCom: function (req, res) {
        var data = mainModel_1.model.readJson(req.params.id);
        var edit = mainModel_1.model.assignCom(req.params.id, "undefined");
        return res.redirect('/view/' + req.params.id);
    },
    roulette: function (req, res) {
        var data = mainModel_1.model.processBody(req.body); // Recibo el dato de los participantes de la ruleta y los guardo
        data = mainModel_1.model.shuffle(data); // Los mezclo
        return res.render("roulette", { myData: data }); // Y renderizo la ruleta, la cual posee otra función que da aleatoriedad al listado
    },
    comList: function (req, res) {
        var json = mainModel_1.model.jsonLister();
        var query = req.query.com ? req.query.com : "";
        if (req.query.com) {
            json = mainModel_1.model.findByCom(query);
        }
        ;
        if (json.length > 0) {
            res.render('listByCom', { data: json, query: query });
        }
        else {
            res.send("No hay documentos JSON");
        }
        ;
    },
    groupsIndex: function (req, res) {
        var groups;
        //req.src.origin == "Google" ? groups = model.groupFinder(req.src) : res.send("Esta función solo está habilitada para los .csv importados desde la rúbrica de Google Spreadsheets")
    }
};
exports.mainController = mainController;
//# sourceMappingURL=mainController.js.map