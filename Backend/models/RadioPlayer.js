/**
 * Created by Nazar on 20.03.2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var radioPlayerSchema = new Schema({
    name:String,
    list:Array,
    currentMusic:String,
    date:Date
});



var RadioPlayer = mongoose.model('RadioPlayer', radioPlayerSchema);

module.exports = RadioPlayer;
