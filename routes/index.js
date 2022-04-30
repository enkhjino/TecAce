var express = require('express');
var router = express.Router();
const spreadsheetsCtrl = require('../controllers/spreadsheets');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/all', spreadsheetsCtrl.read);
router.post('/data', spreadsheetsCtrl.create);
router.delete('/data/:key', spreadsheetsCtrl.delete);
module.exports = router;
