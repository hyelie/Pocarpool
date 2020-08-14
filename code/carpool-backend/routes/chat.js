var express = require('express');
var router = express.Router();
var template = require('../HTML/template').template;

// home
router.get('/', function(req, res, next) {
    res.send(template.chat);
});

module.exports = router;