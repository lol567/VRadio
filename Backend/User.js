var User = require('./models/CreateUser');

function createUser(info){
    var newUser = new User({
        name: info.name,
        id: info.id,
        admin: info.admin,
        created_at: info.date
    });
    User.find({name:newUser.name}, function(err, user) {
        if(user[0]) {
            if (newUser.name != user[0].name) {
                newUser.save(function (err) {
                    if (err) throw err;

                    console.log('User saved successfully!');
                });
            } else {
                console.log("user already create");
            }
        }else {
            newUser.save(function (err) {
                if (err) throw err;

                console.log('User saved successfully!');
            });
        }
    });
}

function getAllUsers(){
    User.find({}, function(err, users) {
        if (err) throw err;

        // object of all the users
        console.log(users);
    });
}

function getUserByName(name){
    User.find({ name: name }, function(err, user) {
        if (err) throw err;

        // object of the user
        console.log(user);
    });
}


function getUserById(id){
    User.find({ id: id }, function(err, user) {
        if (err) throw err;

        // object of the user
        console.log(user);
    });
}

function deleteByName(name){
    User.findOneAndRemove({ name: name }, function(err) {
        if (err) throw err;

            console.log('User successfully deleted!');
    });
}
function deleteById(id){
    User.findOneAndRemove({ id: id }, function(err) {
        if (err) throw err;

        console.log('User successfully deleted!');
    });
}



exports.deleteById = deleteById;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUserByName = getUserByName;
exports.deleteByName = deleteByName;