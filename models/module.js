const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
    formal: {type:String, required: true},
    short_name: {type:String, required: true, unique: true},
    description: {type:String, required: true}
});

module.exports = mongoose.model('Module',moduleSchema);