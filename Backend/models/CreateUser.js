var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
   name: String,
    id: String,
    admin: Boolean,
    created_at: Date
});

userSchema.methods.getName = function() {
    return this.name;
};

userSchema.methods.getId = function() {
    return this.id;
};

userSchema.methods.getCreateTime = function(){
    return this.created_at;
};

userSchema.method.isAdmin = function(){
    return this.admin;
};

var User = mongoose.model('User', userSchema);

module.exports = User;