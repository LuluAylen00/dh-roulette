const path = require('path');
const fs = require('fs');

const fileType = function (req,res,next){
    let file = process.env.DATA_FILE || null;
    if (!file || file == "") {
        process.env.DATA_FILE = "hojaSge.xls"
        process.env.COLUMN = "Alumno"
    }
    let ext = file.split(".").pop();
    
    if (ext == "xls" || ext == "csv") {
        res.locals.file = "xls"
        let pathA = path.resolve("src","data", file);
        console.log(fs.existsSync(pathA));
        if (!fs.existsSync(pathA)) {
            console.log("Falla al cargar el archivo, regresando al estado de prueba");
            file = "hojaSge.xls";
        } else {
            res.locals.path = pathA
        }
    }
    ext == "csv" ? res.locals.file = "csv" : ext == "xls" ? res.locals.file = "xls" : res.send("Formato de archivo no válido, solo están admitidos los formatos .xls y .csv");
    
    next();
}

module.exports = fileType