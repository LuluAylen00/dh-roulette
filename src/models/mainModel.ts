import * as xlsParser from "simple-excel-to-json"; // Requiero mi convertidor de xls a objeto
import * as csvToJson from "convert-csv-to-json"; // Requiero mi convertidor de csv a objeto
import { cleanse } from "../modules/cleanse"; // Requiero un módulo propio que me ayude a limpiar algunas fallas del convertidor de csv
const path = require("path");
const fs = require("fs");
let folder = path.resolve(__dirname, "../data/");

const model = {
    fileLister: function(){
        let fileArray = fs.readdirSync(folder).map((file) => {
            let obj = {
                filename: "",
                ext: ""
            };
            file ? (obj.ext = path.extname(file).slice(1)) : "";
            if (obj.ext == "csv" || obj.ext == "xls"){
                obj.filename = file; 
            }
            return obj;
        });
        return fileArray;
    },
    allToJson: function(){
        let files = model.fileLister();
        let json = [];
        files.forEach(function(file){
            let obj = {
                data: [],
                ext: file.ext // Almaceno la extensión para usarla mas adelante
            };
            // Detecta el tipo de archivo y ejecuta el convertidor que corresponda
            if (file.ext == "csv") {
                let partial =  cleanse(csvToJson.fieldDelimiter(",").getJsonFromCsv(path.resolve(folder, file.filename))); // El csv viene con problemas luego del convertidor, aquí limpio la sintaxis
                obj.data = partial.map(a => a["Estudiante"].includes("Alumno") ? a.Nombre : "");
            } else if (file.ext == "xls") {
                let partial = xlsParser.parseXls2Json(path.resolve(folder, file.filename)).shift(); // Este convertidor crea un array de arrays, pero aunque hay uno solo dentro, me interesa el primero
                obj.data = partial.map(a => a.Alumno.length > 0 ? a.Alumno : "");
            } else {
                obj.data.push("El archivo ha pasado un error");
            }
            json.push(obj);
        })
        return json;
    },
    allParser: function(){
        let allToJson = model.allToJson();
        let parser = [];
        allToJson.forEach(file => {
            let thisFile = [];
            for (let i = 0; i < file.data.length; i++) {
                const alumno = file.data[i];
                let item = { 
                    id: i,
                    name: "" 
                };
                if(file.ext == "csv"){
                    let separated = alumno.split(" ")
                    if (separated.length == 2) {
                        // Si solo hay dos palabras, sería "Nombre y Apellido", lo dejo igual
                        item.name = separated[0] + " " + separated[1];
                    } else if (separated.length >= 3) {
                        // Si hay 3 o mas, conservo la primera y tercera palabra (la cual puede fallar a la hora de dejar un nombre coherente, pero suele ser eficaz)
                        item.name = separated[0] + " " + separated[2];
                    }
                } else if(file.ext == "xls"){
                    let separated = alumno.split(", ");
                    if (alumno != "") {
                        item.name = separated[1].split(" ")[0] + " " + separated[0].split(" ")[0] // Ocupo el primero de cada uno
                    }
                } else {
                    item.name = "Error";
                };
                item.name != "" ? thisFile.push(item) : "";
            }
            parser.push(thisFile);
            
        })
        return parser;
        
    },
    allParsered: function (data, ext) {
        // Consigo el formato (inestable) de "Nombre y apellido" independientemente del tipo de formato inicial
        let newData: any = [];
        if (ext == "csv") {
            // En la rúbrica, los nombres están con el formato de "Nombre1 Nombre2 Apellido1 Apellido2"
            data.map((a, index) => {
                let separated = a.split(" "); // Obtengo el array de todas las palabras que conformen el nombre
                let item = { id: index, name: "" };
                if (separated.length == 2) {
                    // Si solo hay dos palabras, sería "Nombre y Apellido", lo dejo igual
                    item.name = separated[0] + " " + separated[1];
                } else if (separated.length >= 3) {
                    // Si hay 3 o mas, conservo la primera y tercera palabra (la cual puede fallar a la hora de dejar un nombre coherente, pero suele ser eficaz)
                    item.name = separated[0] + " " + separated[2];
                }
                newData.push(item);
            });
        } else {
            data.map((a: string, index: number) => {
                // En el SGE, los nombres están con el formato de "Apellido1 Apellido2, Nombre1 Nombre2"
                let separated = a.split(", "); // Obtengo su información separada, nombres por un lado y apellidos por el otro
                if (a != "") {
                    newData.push({
                        id: index, // Les asigno un ID en base al índice
                        name:
                            separated[1].split(" ")[0] +
                            " " +
                            separated[0].split(" ")[0], // Ocupo el primero de cada uno
                    });
                }
            });
        }
        return newData; // Retorno el array con los nombres actualizados
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
    all: function (locals) {
        // Función exclusiva para el modelo, traerá todos los alumnos y los procesará como el controlador
        //let nuevo = model.allToJson(locals);
        //let soloNombres = model.allProcess(nuevo, locals.column, locals.ext);
        //return model.allParser(soloNombres, locals.ext); // Retorna los nombres tal como el controlador los necesitaría
    },
    one: function (id, locals) {
        // Función exclusiva para el modelo, buscará un alumno en particular
        //return model.all(locals).find((a) => id == a.id);
    },
    processBody: function (data, locals) {
        // Se encarga de procesar el body para la ruleta
        // return Object.keys(data).map(id => model.one(parseInt(id.split("for")[1]), locals).name);
        // Nota lulu: Me desafié a hacerlo en una sola línea y al parecer me salió :o

        // Las claves se llaman "statusfor" + id, por ende, solo me interesan las propiedades del objeto que viene
        let ids = Object.keys(data); // Las claves se llaman "statusfor" + id, por ende, solo me interesan las propiedades del objeto que viene
        let array = [];
        for (let i = 0; i < ids.length; i++) {
            let id = parseInt(ids[i].split("for")[1]);
            let a = model.one(id, locals); // Busco aquellos ids que me hayan llegado y pusheo el nombre correspondiente a mi array
            //array.push(a.name);
        }
        return array;
    },
};

export { model };
