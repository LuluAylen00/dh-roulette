const path = require('path');
const fs = require('fs');

const fileType = function (req,res,next){
    let file = process.env.DATA_FILE || null; // Recupera el archivo
    file && file != "" ? res.locals.file = file : res.locals.file = "hojaSge.xls"
    let pathA = path.resolve("src","data", file);
    res.locals.path = pathA

    if(!fs.existsSync(pathA)){
        console.log("Falla al cargar el archivo, regresando al estado de prueba");
        res.locals.file = "hojaSge.xls";
    }

    
    let ext = file.split(".").pop();
    
    ext == "csv" ? res.locals.column = "Nombre" : res.locals.column = "Alumno"

    ext != "csv" && ext != "xls" ? res.send("Formato de archivo no válido, solo están admitidos los formatos .xls y .csv") : ""
    res.locals.ext = ext

    next();
}

module.exports = fileType