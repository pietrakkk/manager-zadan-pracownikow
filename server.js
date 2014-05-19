var http = require('http');
var express = require('express');
var app = express();
var connect = require('connect');
var httpServer = require("http").createServer(app);
app.use(express.static("public"));



httpServer.listen(3000, function () {
    console.log('Serwer HTTP działa na pocie 3000');
});