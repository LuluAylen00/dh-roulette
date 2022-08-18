const { shuffle, processBody, allToJson, allProcess, allParser } = require('../models/mainModel')

module.exports = {
    index: (req, res) => { 
        let data = [];
        let nuevo = allToJson(res.locals);
        let soloNombres = allProcess(nuevo, res.locals.column, res.locals.ext)
        data = allParser(soloNombres, res.locals.ext);
        return res.render("home", { data });
    },
    secondRoulette: function(req, res) {
        let data = processBody(req.body,res.locals);
        data = shuffle(data);
        return res.render("roulette", { myData: data });
    }
}