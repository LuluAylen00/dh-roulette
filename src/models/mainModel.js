const xlsParser = require('simple-excel-to-json')
const csvToJson = require('convert-csv-to-json');
const cleanse = require('../modules/cleanse')

const model = {
    allToJson: function(locals){
        if (locals.ext == "csv") {
            let json = csvToJson.fieldDelimiter(",").getJsonFromCsv(locals.path);
            let clean = cleanse(json);
            return clean;
        } else if ( locals.ext == "xls"){
            return xlsParser.parseXls2Json(locals.path).shift();
        }
    },
    allProcess: function(array, column, ext){
        if (ext == "xls") {
            return array.map(a=> a[column].length > 0 ? a[column] : "");
        } else {
            // Debido a que algunos registros puede que conserven líneas vacías, las filtramos 
            return array.map(a =>  a.Estudiante.split(" ").shift() == "Alumno" ? a[column] : "");
        }
    },
    allParser: function(array, ext) {
        let newData = [];
        if (ext == "csv") {
            array.map((a,index)=> {
                let separated = a.split(" ");
                let item = { id: index };
                if (separated.length == 2) {
                    item.name = separated[0] + " " + separated[1];
                } else if (separated.length >= 3) {
                    item.name = separated[0] + " " + separated[2];
                }
                newData.push(item);
            });
        } else {
            array.map((a,index)=> {
                let item = { id: index };
                let separated = a.split(", ");
                let lastName = separated[0].split(" ")[0];
                let name = separated[1].split(" ")[0];
                item.name = name + " " + lastName;
                newData.push(item);
            })
        };
        return newData;
    },
    shuffle: (array) => {
        let currentIndex = array.length,  randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        };
        return array;
    },
    all: function(locals){
        let nuevo = model.allToJson(locals);
        let soloNombres = model.allProcess(nuevo, locals.column, locals.ext)
        return model.allParser(soloNombres, locals.ext);
    },
    one: function(id,locals){
        let todos = model.all(locals)
        return todos.find(a => id == a.id)
    },
    processBody: function(data, locals){
        let ids = Object.values(data)[0]
        let status = Object.values(data)[1]
        let array = []
        for (let i = 0; i < status.length; i++) {
            if(status[i] == "active"){
                array.push(model.one(ids[i], locals).name)
            }
        }
        
        return array;
    }
}

module.exports = model