const {Router} = require('express');
const app = Router();
const mainController = require('../controllers/mainController');

app.get('/', mainController.index)

app.post('/roulette', mainController.secondRoulette)
app.get('/first', mainController.firstRoulette)

module.exports = app;