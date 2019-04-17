const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const DivisionSchema = require('./division').schema;
const SessionSchema = require('./session').schema;
const MedsSchema = require('./meds').schema;
const DietarySchema = require('./dietary').schema;
const cSwimOptsSchema = require('./cSwimOpts').schema;

const camperSchema = new Schema({
    _id:String,
    camp_id: String,
    first: {type:String, required: true},
    last: {type:String, required: true},
    gender: {type:String, enum:['male','female'], required: true},
    grade: String,
    division: {type:DivisionSchema},
    division_id: String,
    session_ids:[String],
    sessions:[SessionSchema],
    meds: MedsSchema,
    dietary: DietarySchema,
    cSwimOpts: cSwimOptsSchema,
    weeksEnrolledNS: String,
    p1Name: String,
    p1Email: String,
    p2Name: String,
    p2Email: String
},
{usePushEach : true});

module.exports = mongoose.model('Camper',camperSchema);