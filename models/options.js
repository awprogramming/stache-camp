const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SessionSchema = require('./session').schema;
const EvalOptsSchema = require('./evalOpts').schema;
const SwimOptsSchema = require('./swimOpts').schema;
const CounselorTypeSchema = require('./counselorType').schema;
const HeadStaffTypeSchema = require('./headStaffType').schema;

const optionsSchema = new Schema({
    session:SessionSchema,
    counselor_types:[CounselorTypeSchema],
    headStaff_types:[HeadStaffTypeSchema],
    evaluationOpts: EvalOptsSchema,
    swimOpts: SwimOptsSchema
});

module.exports = mongoose.model('Options',optionsSchema);