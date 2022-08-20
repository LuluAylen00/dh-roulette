const path = require('path');
const fs = require('fs');

const fileType = function (req,res,next){
    req.src = {
        filename: "",
        path: "",
        column: "",
        origin: "",
        ext: ""
    }
    let errors = 0;
    let file = process.env.DATA_FILE || null; // Recupera el archivo del entorno
    // Si no lo hay o está vacío, lo reemplaza con los datos de muestra, si hay, lo guardo en el entorno
    file && file != "" ? req.src.filename = file : req.src.filename = "hojaSge.xls";
    let pathA = path.resolve("src","data", file);  // Creo el path completo del archivo

    // Si no existe, la aplicación vuelve al estado de muestra
    if(!fs.existsSync(pathA)){ 
        // Mensaje en consola
        if (errors == 0) {
            console.log("Falla al cargar el archivo, regresando al estado de prueba")
            errors++
        }
        req.src.filename = "hojaSge.xls"; // Reestablece el archivo de prueba
        pathA = path.resolve("src","data", req.src.filename);  // Creo el path completo actualizado
    }
    req.src.path = pathA // Guardo el path en el entorno

    // Hora de averiguar su formato, como información para el modelo
    let ext = file.split(".").pop();
    if (ext == "csv") { // Si es un archivo CSV, proviene de Google Speadsheets
        req.src.column = "Nombre"; // La columna donde se encuentran los nombres allí es "Nombre"
        req.src.origin = "Google"; // Y especifico su origen
    } else if (ext == "xls") { // Si no lo es, es un XLS proviniente de SGE
        req.src.column = "Alumno"; // La columna donde se encuentran los nombres allí es "Nombre"
        req.src.origin = "SGE"; // Y especifico su origen
    } else { // Si no es ninguno de los dos, devuelve un error
        res.send("Formato de archivo no válido, solo están admitidos los formatos .xls y .csv");
    }
    req.src.ext = ext; // Guardo la extensión en el entorno
    
    errors == 0 ? console.log("Iniciando el proyecto con el archivo de "+ req.src.origin + " ("+req.src.filename+").") : "";
    
    next();
}

export {fileType};