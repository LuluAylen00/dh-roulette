import * as express from "express";
import {join, resolve} from 'path';
const app = express();

const port = 3000;
console.log("Servidor corriendo en el puerto " + port);
app.listen(port);

const {config} = require('dotenv')
config()

app.use(express.urlencoded({extended:true})); 
app.use(express.json())

const publicPath = resolve(__dirname, '../public');
const staticPath = express.static(publicPath);
app.use(staticPath);

app.set ('views', resolve(__dirname, 'views'));
app.set("view engine", "ejs");

import {fileType} from "./middlewares/fileType";
app.use(fileType);

import {indexRoutes} from "./routes/indexRoutes"
app.use(indexRoutes);