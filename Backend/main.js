var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var opener = require('opener');
//package for mongodb
//var mongoose = require('mongoose');

var fs = require('fs');
if(!fs.existsSync("recordings"))
    fs.mkdirSync("recordings");

function configureEndpoints(app) {
    var pages = require('./pages');
    var api = require('./api');
    //Сторінки
    /*app.get('/api/get-radio-list/', api.getRadioList);
    app.post('/api/create-radio/', api.createRadio);
    app.post('/api/create-user/', api.createUser);
    app.post('/api/new-radio-online/', api.postNewOnlineRadio);
    app.get('/api/get-radio-online/', api.getOnlineRadio);*/
    //Головна сторінка
    app.get('/', pages.mainPage);
    app.get('/air', pages.air);
    app.get('/online', pages.online);
    app.get('/create', pages.createRadio);

    //Якщо не підійшов жоден url, тоді повертаємо файли з папки www
    app.use(express.static(path.join(__dirname, '../Frontend/www')));
}

function startServer(port) {
    //Створюється застосунок
    var app = express();

    //Налаштування директорії з шаблонами
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    //Налаштування виводу в консоль списку запитів до сервера
    app.use(morgan('dev'));

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Налаштовуємо сторінки
    configureEndpoints(app);

    var connect = require('connect');
    var serveStatic = require('serve-static');
    connect().use(app.listen(port));
    opener("http://localhost:"+port);
    var server = binaryServer({port: 9001});

    server.on('connection', function(client) {
        console.log("new connection...");
        var fileWriter = null;

        client.on('stream', function(stream, meta) {

            console.log("Stream Start@" + meta.sampleRate +"Hz");
            var fileName = "recordings/air.wav";
            fileWriter = new wav.FileWriter(fileName, {
                channels: 1,
                sampleRate: meta.sampleRate,
                bitDepth: 16
            });

            stream.pipe(fileWriter);
        });

        client.on('close', function() {
            if (fileWriter != null) {
                fileWriter.end();
            }
            console.log("Connection Closed");
        });
    });

    //connect to mongodb
    //mongoose.connect('mongodb://localhost/myappdatabase');

}

exports.startServer = startServer;