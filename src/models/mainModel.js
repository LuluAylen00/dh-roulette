const fs = require('fs');
const {resolve} = require('path');
const parser = require('simple-excel-to-json')
const csvToJson = require('convert-csv-to-json');

const model = {
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
    // Si el archivo es un .xls, se trabajará con lo siguiente:
    xlsToJson: (path)=>{ // Recupera el archivo xls de nuestra comisión, o toma el archivo de muestra
        let array = parser.parseXls2Json(path);
        return array[0];
    },
    dataProcessXls: (data)=>{ // Crea un nuevo array con únicamente el nombre de cada alumno
        let newData = [];
        let column = process.env.COLUMN;
        // Debido a que algunos registros puede que conserven líneas vacías, las filtramos 
        data.map(a=> a[column].length > 0 ? newData.push(a[column]) : "");
        return newData; // Devuelve el array nuevo, solo con los nombres
    },
    fullNameParserXls: (data)=>{ // Para trabajar mejor, convertimos el formato "Apellido1 Apellido2, Nombre1 Nombre2" en "Nombre1 Apellido1"
        let newData = [];
        data.map((a,index)=> {
            let item = { id: index };
            let separated = a.split(", ");
            let lastName = separated[0].split(" ")[0];
            let name = separated[1].split(" ")[0];
            item.name = name + " " + lastName
            newData.push(item);
        })
        return newData;
    },
    // Si el archivo es un .csv, se trabajará con lo siguiente:
    csvToJson: () => { // Recupera el archivo csv de nuestra comisión, o toma el archivo de muestra
        let file = process.env.DATA_FILE || "hojaGoogle.csv";
        let path = resolve("src","data");
        if (!fs.existsSync(resolve(path, file))) {
            console.log("Falla al cargar el archivo, regresando al estado de prueba");
            file = "hojaGoogle.csv";
        }
        let json = csvToJson.fieldDelimiter(",").getJsonFromCsv(resolve(path, file));
        let array = [];
        for(let i=0; i<json.length;i++){
            let element = {}
            let claves = Object.keys(json[i])
            let datos = Object.values(json[i])
            let nuevaClave = []
            claves.forEach((c,index) => {
                nuevaClave.push(c.replace(/"/g, ''))
                element[nuevaClave[index]] = datos[index];
            })
            array.push(element);
        }
        return array;
    },
    dataProcessCsv: (data)=>{ // Crea un nuevo array con únicamente el nombre de cada alumno
        let newData = [];
        let column = process.env.COLUMN;
        data.forEach(a =>  a.Estudiante.split(" ").shift() == "Alumno" && !isNaN(parseInt(a.Grupo)) ? newData.push(a[column]) : "");
        return newData; // Devuelve el array nuevo, solo con los nombres
    },
    fullNameParserCsv: (data)=>{ // Para trabajar mejor, simplificamos el formato "Nombre1 Nombre2 Apellido1 Apellido2" a algo mas acortado, si representa un problema, se puede obviar este paso
        let newData = [];
        data.map((a,index)=> {
            let separated = a.split(" ");
            let item = { id: index };
            if (separated.length == 2) {
                item.name = separated[0] + " " + separated[1];
            } else if (separated.length >= 3) {
                item.name = separated[0] + " " + separated[2];
            }
            newData.push(item)
        })
        return newData;
    },
    processBody: function(data){
        let datos = Object.values(data)
        let array = []
        const chunkSize = 3;
        for (let i = 0; i < datos.length; i += chunkSize) {
            const valueChunk = datos.slice(i, i + chunkSize);
            let object = {
                act: valueChunk[0],
                id: valueChunk[1],
                name: valueChunk[2]
            }
            if (object.act == "true"){
                array.push(object.name)
            }
        }
        return array;
    },
    allToJson: function(data){
        
    }
}

module.exports = model