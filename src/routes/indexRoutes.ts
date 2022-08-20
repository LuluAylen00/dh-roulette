import * as express from "express";
const app = express.Router();
import {mainController} from '../controllers/mainController'

app.get('/', mainController.index)

app.post('/roulette', mainController.secondRoulette)


export {app as indexRoutes}