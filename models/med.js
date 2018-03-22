const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const medSchema = new Schema({
    name:String
});

module.exports = mongoose.model('Med',medSchema);