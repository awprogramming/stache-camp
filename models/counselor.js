const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const DivisionSchema = require('./division').schema;

const counselorSchema = new Schema({
    first: {type:String, required: true},
    last: {type:String, required: true},
    gender: {type:String, enum:['male','female'], required: true},
    division: {type:DivisionSchema}
});

module.exports = mongoose.model('Counselor',counselorSchema);