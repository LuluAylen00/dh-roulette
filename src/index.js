const express = require('express');
const {join, resolve} = require('path');
const app = express();

const port = 3000;
console.log("Servidor corriendo en el puerto " + port);
app.listen(port);

const {config} = require('dotenv')
config()

app.use(express.urlencoded({extended:false})); 
app.use(express.json())

const public = resolve(__dirname, '../public');
const static = express.static(public);
app.use(static);

app.set ('views', resolve(__dirname, 'views'));
app.set("view engine", "ejs");

const fileType = require("./middlewares/fileType")
app.use(fileType);

const indexRoutes = require('./routes/indexRoutes');
app.use(indexRoutes);