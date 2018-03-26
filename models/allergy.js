const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const allergySchema = new Schema({
    name:String
});

module.exports = mongoose.model('Allergy',allergySchema);