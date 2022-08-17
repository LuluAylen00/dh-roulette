const { shuffle, processBody } = require('../models/mainModel')
const { xlsToJson, dataProcessXls, fullNameParserXls } = require('../models/mainModel')
const { csvToJson, dataProcessCsv, fullNameParserCsv } = require('../models/mainModel')

module.exports = {
    index: (req, res) => { 
        let data = [];
        console.log(res.locals.file);
        if (res.locals.file == "xls") {
            let json = xlsToJson(res.locals.path);
            let list = dataProcessXls(json);
            let object = fullNameParserXls(list)
            data = object
            
        } else if ( res.locals.file == "csv"){
            let json = csvToJson()
            let list = dataProcessCsv(json)
            let object = fullNameParserCsv(list)
            data = object
        }
        return res.render("home", { data });
    },
    secondRoulette: function(req, res) {
        let body = req.body
        let data = processBody(body);
        data = shuffle(data);
        return res.render("roulette", { myData: data });
    },
    firstRoulette: function(req, res) {
        let data = [];
        if (res.locals.file == "xls") {
            let json = xlsToJson();
            let list = dataProcessXls(json);
            let object = fullNameParserXls(list)
            object.forEach(o => data.push(o.name))
            
        } else if ( res.locals.file == "csv"){
            let json = csvToJson()
            let list = dataProcessCsv(json)
            let object = fullNameParserCsv(list)
            object.forEach(o => data.push(o.name))
        }
        data = shuffle(data);
        return res.render("roulette", { myData: data });
    }
}