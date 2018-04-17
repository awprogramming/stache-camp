const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const DivisionSchema = require('./division').schema;
const SessionSchema = require('./session').schema;
const MedsSchema = require('./meds').schema;
const DietarySchema = require('./dietary').schema;
const cSwimOptsSchema = require('./cSwimOpts').schema;

const camperSchema = new Schema({
    first: {type:String, required: true},
    last: {type:String, required: true},
    gender: {type:String, enum:['male','female'], required: true},
    grade: Number,
    division: {type:DivisionSchema},
    sessions:[SessionSchema],
    meds: MedsSchema,
    dietary: DietarySchema,
    cSwimOpts: cSwimOptsSchema,
    p1Name: String,
    p1Email: String,
    p2Name: String,
    p2Email: String
});

module.exports = mongoose.model('Camper',camperSchema);