import * as xlsParser from "simple-excel-to-json"; // Requiero mi convertidor de xls a objeto
import * as csvParser from "convert-csv-to-json"; // Requiero mi convertidor de csv a objeto
import { cleanse } from "./cleanse"; // Requiero un módulo propio que me ayude a limpiar algunas fallas del convertidor de csv

const csvToJson = function(path){
    let data = [];
    let partial =  cleanse(csvParser.fieldDelimiter(",").getJsonFromCsv(path)); // El csv viene con problemas luego del convertidor, aquí limpio la sintaxis
    let filter = partial.map(a => {
        return {
            name: a["Estudiante"].includes("Alumno") ? a.Nombre : "",
            group: a["Estudiante"].includes("Alumno") ? a.Grupo : undefined
        }
    });
    for (let i = 0; i < filter.length; i++) {
        let alumno = filter[i];
        let item = { 
            id: i,
            wins: 0,
            name: "",
            group: alumno.group 
        };
        let separated = alumno.name.split(" ") // Obtengo el array de todas las palabras que conformen el nombre
        if (separated.length == 2) {
            // Si solo hay dos palabras, sería "Nombre y Apellido", lo dejo igual
            item.name = separated[0] + " " + separated[1];
        } else if (separated.length >= 3) {
            // Si hay 3 o mas, conservo la primera y tercera palabra (la cual puede fallar a la hora de dejar un nombre coherente, pero suele ser eficaz)
            item.name = separated[0] + " " + separated[2];
        } else {
            item.name = "Error";
        };
        data.push(item);
    }
    return data
}

const xlsToJson = function(path){
    let data = [];
    let partial = xlsParser.parseXls2Json(path).shift(); // Este convertidor crea un array de arrays, pero aunque hay uno solo dentro, me interesa el primero
    let filter = partial.map(a => {
        return {
            name: a.Alumno.length > 0 ? a.Alumno : "",
            group: undefined,
        }
    });
    for (let i = 0; i < filter.length; i++) {
        let alumno = filter[i];
        let item = { 
            id: i,
            wins: 0,
            name: "",
            group: alumno.group 
        };
        // Esta separación es mas sencilla, Apellidos y nombres están separados por una coma
        let separated = alumno.name.split(", ");
        if (alumno.name != "") {
            item.name = separated[1].split(" ")[0] + " " + separated[0].split(" ")[0] // Y ocupo el primero de cada uno
        }else {
            item.name = "Error";
        };
        if(item && item.name != "Error"){
            data.push(item);
        }
    }
    return data
}

export {csvToJson, xlsToJson}