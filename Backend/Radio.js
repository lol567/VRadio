var Radio = require('./models/CreateRadio');

function createRadio(info){
    var newRadio = new Radio({
        name: info.name,
        style: info.style,
        description: info.description,
        admin: info.admin,
        img: info.img
    });
    Radio.find({name:newRadio.name}, function(err, radio) {
        if(radio[0]) {
            if (newRadio.name != radio[0].name) {
                newRadio.save(function (err) {
                    if (err) throw err;

                    console.log('Radio saved successfully!');
                });
            }else{
                console.log("radio already create");
            }
        } else {
            newRadio.save(function (err) {
            if (err) throw err;

            console.log('Radio saved successfully!');
        });
    }
    });
}

function getAllRadio(){
    Radio.find({}, function(err, radios) {
        if (err) throw err;

        // object of all the radios
        console.log(radios);
    });
}

function getRadioByName(name){
    Radio.find({ name: name }, function(err, radio) {
        if (err) throw err;

        // object of the radio
        console.log(radio);
    });
}

function getRadioByAdmin(admin){
    Radio.find({ admin: admin }, function(err, radio) {
        if (err) throw err;

        // object of the radio
        console.log(radio);
    });
}

function getRadioByAdminAndName(admin, name){
    Radio.find({ admin: admin, name: name }, function(err, radio) {
        if (err) throw err;

        // object of the radio
        console.log(radio);
    });
}

function deleteByName(name){
    Radio.findOneAndRemove({ name: name }, function(err) {
        if (err) throw err;

        console.log('User successfully deleted!');
    });
}

function deleteByAdmin(admin){
    Radio.findOneAndRemove({ admin: admin }, function(err) {
        if (err) throw err;

        console.log('User successfully deleted!');
    });
}


exports.createRadio = createRadio;
exports.getAllRadio = getAllRadio;
exports.getRadioByName = getRadioByName;
exports.deleteByName = deleteByName;
exports.getRadioByAdmin= getRadioByAdmin;
exports.getRadioByAdminAndName =  getRadioByAdminAndName;
exports.deleteByAmin = deleteByAdmin;