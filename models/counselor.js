const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const DivisionSchema = require('./division').schema;
const SpecialtySchema = require('./specialty').schema;
const SessionSchema = require('./session').schema;
const CounselorTypeSchema = require('./counselorType').schema;
const EvaluationSchema = require('./evaluation').schema;

const counselorSchema = new Schema({
    _id: { type: String },
    first: {type:String, required: true},
    last: {type:String, required: true},
    gender: {type:String, enum:['male','female'], required: true},
    camp_id:String,
    division_id:String,
    specialty_id:String,
    division: {type:DivisionSchema},
    type: CounselorTypeSchema,
    specialty: {type:SpecialtySchema},
    session_ids: [String],
    sessions:[SessionSchema],
    evaluations:[EvaluationSchema]
},
{usePushEach : true});

module.exports = mongoose.model('Counselor',counselorSchema);