const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const DivisionSchema = require('./division').schema;
const SpecialtySchema = require('./specialty').schema;
const SessionSchema = require('./session').schema;
const CounselorTypeSchema = require('./counselorType').schema;
const EvaluationSchema = require('./evaluation').schema;

const counselorSchema = new Schema({
    first: {type:String, required: true},
    last: {type:String, required: true},
    gender: {type:String, enum:['male','female'], required: true},
    division: {type:DivisionSchema},
    type: CounselorTypeSchema,
    specialty: {type:SpecialtySchema},
    sessions:[SessionSchema],
    evaluations:[EvaluationSchema]
});

module.exports = mongoose.model('Counselor',counselorSchema);