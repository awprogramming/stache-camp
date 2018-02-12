const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    name:{type:String, required: true},
});

module.exports = mongoose.model('Session',sessionSchema);