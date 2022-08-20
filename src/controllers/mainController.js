const { shuffle, processBody, allToJson, allProcess, allParser, groupFinder } = require('../models/mainModel')

module.exports = {
    index: (req, res) => { 
        let locals = process.env; // Guardo mi entorno en una variable que esté al alcance
        let data = [];
        let nuevo = allToJson(locals); // Convierto los datos a un array de objetos (le paso el entorno porque de ahí es donde el modelo sabe de que formato debe convertir)
        let soloNombres = allProcess(nuevo, locals.column, locals.ext); // Proceso los objetos para que solo contengan el nombre y para arreglar otros inconvenientes
        data = allParser(soloNombres, locals.ext); // Les doy a esos objetos el formato que necesito usar
        return res.render("home", { data }); // Renderizo el formulario inicial con el array ya procesado
    },
    secondRoulette: function(req, res) {
        let data = processBody(req.body,process.env); // Recibo el dato de los participantes de la ruleta y los guardo
        data = shuffle(data); // Los mezclo
        return res.render("roulette", { myData: data }); // Y renderizo la ruleta, la cual posee otra función que da aleatoriedad al listado
    },
    groupsIndex: function(req, res) {
        let groups
        process.env.ORIGIN == "Google" ? groups = groupFinder(process.env) : res.send("Esta función solo está habilitada para los .csv importados desde la rúbrica de Google Spreadsheets")
        
    }
}