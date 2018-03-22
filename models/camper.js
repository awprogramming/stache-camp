const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const DivisionSchema = require('./division').schema;
const SessionSchema = require('./session').schema;
const MedsSchema = require('./meds').schema;

const camperSchema = new Schema({
    first: {type:String, required: true},
    last: {type:String, required: true},
    gender: {type:String, enum:['male','female'], required: true},
    division: {type:DivisionSchema},
    sessions:[SessionSchema],
    meds: [MedsSchema]
});

module.exports = mongoose.model('Camper',camperSchema);