import {model} from "../models/mainModel";

let mainController = {
    index: (req, res) => {
        res.render('homepage')
    },
    convert: (req, res) => { 
        let files = model.fileLister();
        res.render('toConvert', { files })
    },
    new: (req, res) => {
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
    view: (req, res) => {
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
    list: (req, res) => {
        let src = req.src; // Guardo mi entorno en una variable que esté al alcance
        let data = [];
        //let nuevo = model.allToJson(src); // Convierto los datos a un array de objetos (le paso el entorno porque de ahí es donde el modelo sabe de que formato debe convertir)
        
        //let soloNombres = model.allProcess(nuevo, src.column, src.ext); // Proceso los objetos para que solo contengan el nombre y para arreglar otros inconvenientes
        //data = model.allParser(soloNombres, src.ext); // Les doy a esos objetos el formato que necesito usar
        return res.render("takeList", { data }); // Renderizo el formulario inicial con el array ya procesado
    },
    secondRoulette: function(req, res) {
        let data = model.processBody(req.body); // Recibo el dato de los participantes de la ruleta y los guardo
        data = model.shuffle(data); // Los mezclo
        return res.render("roulette", { myData: data }); // Y renderizo la ruleta, la cual posee otra función que da aleatoriedad al listado
    },
    groupsIndex: function(req, res) {
        let groups
        //req.src.origin == "Google" ? groups = model.groupFinder(req.src) : res.send("Esta función solo está habilitada para los .csv importados desde la rúbrica de Google Spreadsheets")
        
    }
}

export {mainController}