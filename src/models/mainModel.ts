import { xlsToJson, csvToJson } from "../modules/parser";
const path = require("path");
const fs = require("fs");
let folder = path.resolve(__dirname, "../../src/data/");

const model = {
    // Enlistador de archivos
    tableLister: function () {
        let toSend = [];
        let fileArray = fs.readdirSync(folder).map((file, index) => {
            let obj = {
                filename: "", //
                ext: file ? path.extname(file).slice(1) : "",
                name: file.replace(/\.[^/.]+$/, ""),
                id: index,
            };
            if (obj.ext == "csv" || obj.ext == "xls") {
                obj.filename = file;
            }
            return obj;
        });

        fileArray.forEach((file) => {
            let exists = fs.existsSync(
                path.resolve(folder, "json", file.filename + ".json")
            );
            if (file.filename != "") {
                if (
                    !fs.existsSync(
                        path.resolve(
                            folder,
                            "json",
                            file.filename.split(".")[0] + ".json"
                        )
                    )
                ) {
                    file.id = toSend.length;
                    toSend.push(file);
                }
            }
        });
        return toSend;
    },

    // Conversor de todos los archivos a formato JSON
    allToJson: function (prevData?: any) {
        let files = model.tableLister();
        let status: boolean;
        let json = [];
        files.forEach(function (file, index) {
            let obj = {
                data: [],
                ext: file.ext, // Almaceno la extensión para usarla mas adelante
                id:
                    model.jsonLister().length > 0
                        ? model.top(model.jsonLister()) + 1
                        : 0,
                name: files[index].name,
                com: "undefined",
            };

            // Detecta el tipo de archivo y ejecuta el convertidor que corresponda
            if (file.ext == "csv") {
                obj.data = csvToJson(path.resolve(folder, file.filename));
            } else if (file.ext == "xls") {
                obj.com =
                    file.filename.split("-")[3] == "comision"
                        ? file.filename.split("-")[4].toUpperCase()
                        : "undefined";
                obj.data = xlsToJson(path.resolve(folder, file.filename));
            } else {
                obj.ext = "Error";
            }
            obj.ext != "Error" ? json.push(obj) : "";
            let thisPath = path.resolve(folder, "json", obj.name + ".json");
            if (!fs.existsSync(thisPath)) {
                console.log("Creado un nuevo JSON -> " + obj.name + ".json");
                fs.writeFileSync(thisPath, JSON.stringify(obj, null, 2));
                status = true;
            } else {
                status = false;
            }
        });
        return {
            data: json,
            status: status,
        };
    },

    // Buscador de archivos (JSON)
    findJson: function (id) {
        let list = model.jsonLister();
        return list.find((j) => j.id == id);
    },

    // Listador de archivos JSON
    jsonLister: function () {
        let toSend = [];
        let fileArray = fs.readdirSync(folder + "/json/").map((file, index) => {
            let fileExt: string;
            let filename: string;
            file ? (fileExt = path.extname(file).slice(1)) : "";
            if (fileExt == "json") {
                filename = file;
            }
            return filename;
        });
        if (fileArray.length > 0) {
            
            fileArray.forEach((file) => {
                if (file) {
                    let json = JSON.parse(
                        fs.readFileSync(path.resolve(folder, "json", file))
                    );
                    toSend.push(json);
                }
            });
        }
        
        return model.order(toSend);
    },

    // Buscador de JSON por comisión
    findByCom: function (com) {
        let list = model.jsonLister();
        return list.filter((j) => j.com.includes(com));
    },

    top: function (array) {
        let top = 0;
        array.forEach((e) => {
            if (e.id > top) {
                top = e.id;
            }
        });
        return top;
    },

    order: function (array) {
        let final = array.sort(function (a, b) {
            if (a.id > b.id) {
              return -1;
            }
            if (a.id < b.id) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
        return final
    },

    // Randomizador
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

    // Guardador de JSON (obj to JSON), con buscador
    writeJson: (obj, id) => {
        let json = model.findJson(id);
        let thisPath = path.resolve(folder, "json", json.name + ".json");
        fs.writeFileSync(thisPath, JSON.stringify(obj, null, 2));
        return obj;
    },

    // Lector de JSON (JSON to obj)
    readJson: (id) => {
        let json = model.findJson(id);
        let thisPath = path.resolve(folder, "json", json.name + ".json");
        return JSON.parse(fs.readFileSync(thisPath));
    },

    // Asignador de comisión (Con lector y guardador incorporados)
    assignCom: (id, com) => {
        let json = model.findJson(id);
        let thisPath = path.resolve(folder, "json", json.name + ".json");
        let obj = JSON.parse(fs.readFileSync(thisPath));
        obj.com = com != "undefined" ? com : "undefined";
        fs.writeFileSync(thisPath, JSON.stringify(obj, null, 2));
        return obj;
    },

    // Buscador de JSON (sin conversor)
    one: function (id) {
        let json = model.findJson(id);
        return json;
    },

    // Editor de JSON para sumar una victoria a un alumno
    win: function (id, jsonId) {
        let obj = model.readJson(jsonId);
        let found = false;
        obj.data.map((a) => {
            if (a.id == id) {
                a.wins++;
                found = true;
            }
        });
        if (found) {
            console.log("Tenemos un ganador");
        } else {
            console.log("No ha ganado nadie");
        }
        console.log("Reiniciando ruleta");
        model.writeJson(obj, jsonId);
        return obj;
    },

    // Procesador de formulario para crear la ruleta (lista a ruleta)
    processBody: function (data, id) {
        // Se encarga de procesar el body para la ruleta
        if (data.winner) {
            // Si hay un ganador, viene como primer dato del listado, asique lo elimino y le doy una victoria en su lista
            model.win(data.winner, id);
        }
        delete data.winner;
        let json = model.findJson(id).data; // Busco el json específico para traer la lista de alumnos
        let ids = Object.keys(data); // Las claves se llaman "statusfor" + id, por ende, solo me interesan las propiedades del objeto

        let array = []; // Acumulador
        ids.forEach((a, i) => {
            // Aquellos id que hayan llegado son los que estarán presentes, por lo que son los que debo buscar en el array de alumnos
            let id = parseInt(ids[i].split("for")[1]);
            array.push(json.find((al) => al.id == id));
        });
        return array;
    },
};

export { model };
