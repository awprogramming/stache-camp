const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const UserSchema = require('./user').schema;
const ModuleSchema = require('./module').schema;


const campSchema = new Schema({
    name: {type:String, required: true, unique: true},
    admin: UserSchema,
    users: [UserSchema],
    modules: [ModuleSchema]
});

module.exports = mongoose.model('Camp',campSchema);