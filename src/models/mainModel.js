const xlsParser = require("simple-excel-to-json"); // Requiero mi convertidor de xls a objeto
const csvToJson = require("convert-csv-to-json"); // Requiero mi convertidor de csv a objeto
const cleanse = require("../modules/cleanse"); // Requiero un módulo propio que me ayude a limpiar algunas fallas del convertidor de csv

const model = {
    allToJson: function (locals) {
        // Detecta el tipo de archivo y ejecuta el convertidor que corresponda
        if (locals.ext == "csv") {
            return cleanse(csvToJson.fieldDelimiter(",").getJsonFromCsv(locals.path)); // El csv viene con problemas luego del convertidor, aquí limpio la sintaxis
        } else if (locals.ext == "xls") {
            return xlsParser.parseXls2Json(locals.path).shift(); // Este convertidor crea un array de arrays, pero aunque hay uno solo dentro, me interesa el primero
        }
    },
    allProcess: function (array, column, ext) {
        // Dependiendo del tipo de archivo, proceso los datos para dejar solo los nombres
        if (ext == "xls") {
            return array.map((a) => (a[column].length > 0 ? a[column] : ""));
        } else {
            // Debido a que algunos registros puede que conserven líneas vacías, las filtramos
            return array.map((a) =>
                a.Estudiante.split(" ").shift() == "Alumno" ? a[column] : ""
            );
        }
    },
    allParser: function (array, ext) {
        // Consigo el formato (inestable) de "Nombre y apellido" independientemente del tipo de formato inicial
        let newData = [];
        if (ext == "csv") {
            // En la rúbrica, los nombres están con el formato de "Nombre1 Nombre2 Apellido1 Apellido2"
            array.map((a, index) => {
                let separated = a.split(" "); // Obtengo el array de todas las palabras que conformen el nombre
                let item = { id: index };
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
            array.map((a, index) => {
                // En el SGE, los nombres están con el formato de "Apellido1 Apellido2, Nombre1 Nombre2"
                let separated = a.split(", "); // Obtengo su información separada, nombres por un lado y apellidos por el otro
                if (a != "") {
                    newData.push({
                        id: index, // Les asigno un ID en base al índice
                        name: separated[1].split(" ")[0] + " " + separated[0].split(" ")[0] // Ocupo el primero de cada uno
                    });
                }
            });
        }
        return newData; // Retorno el array con los nombres actualizados
    },
    shuffle: (array) => {
        // Primera función para randomizar la lista
        let currentIndex = array.length, randomIndex;
        // El while hará la cuenta regresiva para ir cambiando los elementos
        while (currentIndex != 0) {
            // Escojo un elemento aleatorio
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // Y lo cambio por el elemento actual del index
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    },
    all: function (locals) {
        // Función exclusiva para el modelo, traerá todos los alumnos y los procesará como el controlador
        let nuevo = model.allToJson(locals);
        let soloNombres = model.allProcess(nuevo, locals.column, locals.ext);
        return model.allParser(soloNombres, locals.ext); // Retorna los nombres tal como el controlador los necesitaría
    },
    one: function (id, locals) {
        // Función exclusiva para el modelo, buscará un alumno en particular
        return model.all(locals).find(a => id == a.id);
    },
    processBody: function (data, locals) {
        // Se encarga de procesar el body para la ruleta
        return Object.keys(data).map(id => model.one(parseInt(id.split("for")[1]), locals).name);
        // Nota lulu: Me desafié a hacerlo en una sola línea y al parecer me salió :o

        /*
            // Las claves se llaman "statusfor" + id, por ende, solo me interesan las propiedades del objeto que viene
            let ids = Object.keys(data); // Las claves se llaman "statusfor" + id, por ende, solo me interesan las propiedades del objeto que viene
            let array = [];
            console.log(ids);
            for (let i = 0; i < ids.length; i++) {
                let id = parseInt(ids[i].split("for")[1]);
                let a = model.one(id, locals); // Busco aquellos ids que me hayan llegado y pusheo el nombre correspondiente a mi array
                array.push(a.name);
            };
            return array;
        */
    },
};

module.exports = model;
