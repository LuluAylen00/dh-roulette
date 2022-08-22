import {model} from "../models/mainModel";

let mainController = {
    index: (req, res) => {
        res.render('homepage')
    },
    toConvertList: (req, res) => { 
        let files = model.fileLister();
        res.render('toConvert', { files })
    },
    uploadTable: (req, res) => {
        console.log("Fichero", req.file.filename, "subido");
        res.redirect('/convert')
    },
    convertThis: (req, res) => {
        let id = req.params.id;
        let thisOne = model.saveJson(id);
        res.redirect('/list');
    },
    jsonList: (req, res) => {
        let json = model.jsonLister();
        if (json.length > 0) {
            res.render('jsonList', { data: json })
        } else {
            res.send("No hay documentos JSON");
        }
    },
    jsonDetail: (req, res) => {
        let data = model.readJson(req.params.id);
        return res.render("takeList", { data });
    },
    assignCom: (req, res) => {
        let data = model.readJson(req.params.id);
        let edit = model.assignCom(req.params.id, req.body.adjust);
        return res.redirect('/view/'+req.params.id);
    },
    unassignCom: (req, res) => {
        let data = model.readJson(req.params.id);
        let edit = model.assignCom(req.params.id, "undefined");
        return res.redirect('/view/'+req.params.id);
    },
    roulette: function(req, res) {
        let data = model.processBody(req.body); // Recibo el dato de los participantes de la ruleta y los guardo
        data = model.shuffle(data); // Los mezclo
        return res.render("roulette", { myData: data }); // Y renderizo la ruleta, la cual posee otra función que da aleatoriedad al listado
    },
    comList: function(req, res){
        let json = model.jsonLister();
        let query = req.query.com ? req.query.com : "";
        if (req.query.com) {
            json = model.findByCom(query);
        };
        if (json.length > 0) {
            res.render('listByCom', { data: json, query });
        } else {
            res.send("No hay documentos JSON");
        };
    },
    groupsIndex: function(req, res) {
        let groups
        //req.src.origin == "Google" ? groups = model.groupFinder(req.src) : res.send("Esta función solo está habilitada para los .csv importados desde la rúbrica de Google Spreadsheets")
        
    },
}

export {mainController}