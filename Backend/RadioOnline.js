/**
 * Created by Nazar on 20.03.2016.
 */
var RadioPlayer = require('./models/RadioPlayer');

function createOnlineRadio(info){
    var newOnlineRadio = new RadioPlayer({
        name:info.name,
        list:info.list,
        currentMusic:info.currentMusic,
        date:info.date
    });
    newOnlineRadio.save(function (err) {
        if (err) throw err;

        console.log('Online radio saved successfully!');
    });
}

function getAllRadio(){
    RadioPlayer.find({ }, function(err, radio) {
        if (err) throw err;

        // object of the user
        console.log(radio);
    });
}

function getOnlineRadioByName(name){
    RadioPlayer.find({ name: name }, function(err, radio) {
        if (err) throw err;

        // object of the user
        console.log(radio);
    });
}

function updateOnlineRadio(name, music, date){
    RadioPlayer.findOneAndUpdate({ name: name }, { currentMusic:music,date:date }, function(err, radio) {
        if (err) throw err;

        // we have the updated online radio returned to us
        console.log(radio);
    });
}

function deleteOnlineRadioByName(name){
    RadioPlayer.findOneAndRemove({ name: name }, function(err, radio) {
        if (err) throw err;

        // object of the user
        console.log('Online radio successfully deleted!');
    });
}

exports.getAllRadio = getAllRadio;
exports.createOnlineRadio = createOnlineRadio;
exports.getOnlineRadioByName = getOnlineRadioByName;
exports.deleteOnlineRadioByName = deleteOnlineRadioByName;
exports.updateOnlineRadio = updateOnlineRadio;