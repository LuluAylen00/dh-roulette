import * as express from "express";
const app = express.Router();
import {mainController} from '../controllers/mainController'

app.get('/', mainController.index)

app.get('/list/:comId', mainController.newList)

app.get('/list/', mainController.list)

app.post('/roulette', mainController.secondRoulette)


export {app as indexRoutes}