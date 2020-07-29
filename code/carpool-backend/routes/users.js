var express = require('express');
var template = require('../HTML/template').template;
var DB = require('../db/initiate').connection;

var router = express.Router();

/* GET users listing. */
 router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}); 



module.exports = router;
