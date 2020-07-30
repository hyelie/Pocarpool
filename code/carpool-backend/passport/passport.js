const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var DB = require('../db/initiate').connection;