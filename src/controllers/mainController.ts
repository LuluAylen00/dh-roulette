import {model} from "../models/mainModel";

let mainController = {
    index: (req, res) => {
        res.render('homepage');
    },
    toConvertList: (req, res) => { 
        let files = model.tableLister();
        res.render('toConvert', { files });
    },
    uploadTable: (req, res) => {
        console.log("Fichero", req.file.originalname, "subido");        
        res.redirect('/convert');
    },
    convertThis: (req, res) => {
        let result = model.allToJson();
        
        if(result.status){
            return res.redirect('/list');
        } else {
            let data = model.readJson(result.data.shift().id);
            return res.render("takeList", { data });
        }
    },
    jsonList: (req, res) => {
        let json = model.jsonLister();
        if (json.length > 0) {
            res.render('jsonList', { data: json });
        } else {
            res.send("No hay documentos JSON");
        }
    },
    jsonDetail: (req, res) => {
        let data = model.readJson(req.params.id);
        return res.render("takeList", { data, com: req.params.id });
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
        let data = model.processBody(req.body, req.params.id); // Recibo el dato de los participantes de la ruleta y los guardo
        data = model.shuffle(data); // Los mezclo
        return res.render("roulette", { myData: data, com: req.params.id }); // Y renderizo la ruleta, la cual posee otra función que da aleatoriedad al listado
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