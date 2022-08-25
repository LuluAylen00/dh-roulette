import * as xlsParser from "simple-excel-to-json"; // Requiero mi convertidor de xls a objeto
import * as csvToJson from "convert-csv-to-json"; // Requiero mi convertidor de csv a objeto
import { cleanse } from "../modules/cleanse"; // Requiero un módulo propio que me ayude a limpiar algunas fallas del convertidor de csv
const path = require("path");
const fs = require("fs");
let folder = path.resolve(__dirname, "../../src/data/");

const model = {
    fileLister: function(){
        let toSend = [];
        let fileArray = fs.readdirSync(folder).map((file, index) => {
            let obj = {
                filename: "", // 
                ext: file ? path.extname(file).slice(1) : "",
                name: file.replace(/\.[^/.]+$/, ""),
                id: index
            };
            if (obj.ext == "csv" || obj.ext == "xls"){
                obj.filename = file; 
            };
            return obj;
        });
        fileArray.slice().reverse().forEach((file, index) => {
            let id = 0
            if (file.filename != "") {
                file.id = toSend.length;
                toSend.push(file);
            };
        });
        return toSend;
    },
    allToJson: function(){
        let files = model.fileLister();
        let json = [];
        files.forEach(function(file, index){
            let obj = {
                data: [],
                ext: file.ext, // Almaceno la extensión para usarla mas adelante
                id: files[index].id,
                name: files[index].name
            };
            // Detecta el tipo de archivo y ejecuta el convertidor que corresponda
            if (file.ext == "csv") {
                let partial =  cleanse(csvToJson.fieldDelimiter(",").getJsonFromCsv(path.resolve(folder, file.filename))); // El csv viene con problemas luego del convertidor, aquí limpio la sintaxis
                obj.data = partial.map(a => a["Estudiante"].includes("Alumno") ? a.Nombre : "");
            } else if (file.ext == "xls") {
                let partial = xlsParser.parseXls2Json(path.resolve(folder, file.filename)).shift(); // Este convertidor crea un array de arrays, pero aunque hay uno solo dentro, me interesa el primero
                obj.data = partial.map(a => a.Alumno.length > 0 ? a.Alumno : "");
            } else {
                obj.ext = "Error";
            }
            obj.ext != "Error" ? json.push(obj) : "";
        })
        return json;
    },
    allParser: function(){
        // Consigo el formato (inestable) de "Nombre y apellido" independientemente del tipo de formato inicial
        let allToJson = model.allToJson();
        let parser = [];
        allToJson.forEach((file, index) => {
            let thisFile = [];
            let obj = {
                data: [],
                id: allToJson[index].id,
                com: "",
                name: allToJson[index].name
            }
            for (let i = 0; i < file.data.length; i++) {
                const alumno = file.data[i];
                let item = { 
                    id: i,
                    wins: 0,
                    name: "" 
                };
                if(file.ext == "csv"){
                    // En la rúbrica, los nombres están con el formato de "Nombre1 Nombre2 Apellido1 Apellido2"
                    let separated = alumno.split(" ") // Obtengo el array de todas las palabras que conformen el nombre
                    if (separated.length == 2) {
                        // Si solo hay dos palabras, sería "Nombre y Apellido", lo dejo igual
                        item.name = separated[0] + " " + separated[1];
                    } else if (separated.length >= 3) {
                        // Si hay 3 o mas, conservo la primera y tercera palabra (la cual puede fallar a la hora de dejar un nombre coherente, pero suele ser eficaz)
                        item.name = separated[0] + " " + separated[2];
                    } else {
                        item.name = "Error";
                    };
                } else if(file.ext == "xls"){
                    // Esta separación es mas sencilla, Apellidos y nombres están separados por una coma
                    let separated = alumno.split(", ");
                    if (alumno != "") {
                        item.name = separated[1].split(" ")[0] + " " + separated[0].split(" ")[0] // Y ocupo el primero de cada uno
                    }else {
                        item.name = "Error";
                    };
                } else {
                    item.name = "Error";
                };
                item.name != "Error" ? obj.data.push(item) : "";
            }
            parser.push(obj);
        })
        return parser;
        
    },
    findFile: function(id){
        let allParser = model.allParser();
        return allParser.find(file => file.id == id);
    },
    jsonLister: function(){
        let toSend = [];
        let fileArray = fs.readdirSync(folder+"/json/").map((file, index) => {
            let fileExt : string;
            let filename : string;
            file ? (fileExt = path.extname(file).slice(1)) : "";
            if (fileExt == "json"){
                filename = file; 
            };
            return filename;
        });        
        if (fileArray.length > 0) {
            fileArray.forEach((file, index) => {
                if (file) {
                    let json = JSON.parse(fs.readFileSync(path.resolve(folder,"json",file)));
                    toSend.push(json);
                };
            });
        }
        return toSend;
    },
    findJson: function(id){
        let list = model.jsonLister();
        return list.find(j => j.id == id);
    },
    findByCom: function(com){
        let list = model.jsonLister();
        return list.filter(j => j.com.includes(com));
    },
    saveJson: function(index){
        let thisOne = model.findFile(index);
        let newObj = {
            data: thisOne.data,
            id: model.jsonLister().length,
            com: "undefined",
            name: thisOne.name
        };
        let thisPath = path.resolve(folder,"json", thisOne.name+".json");
        if (!fs.existsSync(thisPath)) {
            fs.writeFileSync(thisPath, JSON.stringify(newObj,null,2));
            return newObj;
        } else {
            console.log("El archivo ya existe, no se puede sobreescribir");
            console.log("Iniciando aplicación");
            let already = JSON.parse(fs.readFileSync(thisPath))
            return model.findJson(already.id);
        };
    },
    shuffle: (array) => {
        // Primera función para randomizar la lista
        let currentIndex = array.length,
            randomIndex;
        // El while hará la cuenta regresiva para ir cambiando los elementos
        while (currentIndex != 0) {
            // Escojo un elemento aleatorio
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // Y lo cambio por el elemento actual del index
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    },
    writeJson: (obj, id) => {
        let json = model.findJson(id);
        let thisPath = path.resolve(folder, "json", json.name+".json");
        fs.writeFileSync(thisPath, JSON.stringify(obj,null,2));
        return obj;
    },
    readJson: (id) => {
        let json = model.findJson(id);
        let thisPath = path.resolve(folder, "json", json.name+".json");
        return JSON.parse(fs.readFileSync(thisPath));
    },
    assignCom: (id, com) => {
        let json = model.findJson(id);
        let thisPath = path.resolve(folder, "json", json.name+".json");
        let obj = JSON.parse(fs.readFileSync(thisPath));
        obj.com = com != "undefined" ? com : "undefined" ;
        fs.writeFileSync(thisPath, JSON.stringify(obj,null,2));
        return obj;
    },
    one: function(id) {
        let json = model.findJson(id);
        return json;
    },
    win: function(id, jsonId){
        let obj = model.readJson(jsonId);
        let found = false;
        obj.data.map(a => {
            if (a.id == id) {
                a.wins++
                found = true;
            }
        })
        if (found) {
            console.log("Tenemos un ganador");
        } else {
            console.log("No ha ganado nadie");
        }
        console.log("Reiniciando ruleta");
        model.writeJson(obj, jsonId)
        return obj        
    },
    processBody: function (data, id) {
        // Se encarga de procesar el body para la ruleta
        if (data.winner) { // Si hay un ganador, viene como primer dato del listado, asique lo elimino y le doy una victoria en su lista
            model.win(data.winner, id)
        }
        delete data.winner
        let json = model.findJson(id).data; // Busco el json específico para traer la lista de alumnos
        let ids = Object.keys(data); // Las claves se llaman "statusfor" + id, por ende, solo me interesan las propiedades del objeto
        
        let array = []; // Acumulador
        ids.forEach((a, i) => {
            // Aquellos id que hayan llegado son los que estarán presentes, por lo que son los que debo buscar en el array de alumnos
            let id = parseInt(ids[i].split("for")[1]);
            array.push(json.find(al => al.id == id));
        });
        return array;
    },
};

export { model };
