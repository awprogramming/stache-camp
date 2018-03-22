const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const UserSchema = require('./user').schema;

const divisionSchema = new Schema({
    name: {type:String, required: true},
    leaders: [UserSchema],
    approvers: [UserSchema],
    gender:{type:String, enum:['male','female'], required: true},
});

module.exports = mongoose.model('Division',divisionSchema);