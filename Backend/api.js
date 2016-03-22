/**
 * Created by Nazar on 19.03.2016.
 */
var Radio = require('./Radio');
var User = require('./User');
var RadioOnline = require('./RadioOnline');

exports.getRadioList = function(req, res) {
    res.send(Radio.getAllRadio());
};

exports.createRadio = function(req, res) {
    var create_info = req.body;
    Radio.createRadio(create_info);
};

exports.createUser = function(req, res) {
    var create_info = req.body;
    User.createUser(create_info);
};

exports.postNewOnlineRadio = function(req, res){
    var create_info = req.body;
    RadioOnline.createOnlineRadio(create_info);
};

exports.getOnlineRadio = function(req, res){
    res.send(RadioOnline.getOnlineRadioByName('test'));
};