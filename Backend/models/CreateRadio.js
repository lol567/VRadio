var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var radioSchema = new Schema({
    name: String,
    style: String,
    description: String,
    admin: String,
    img: String
});



var Radio = mongoose.model('Radio', radioSchema);

module.exports = Radio;