const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const CounselorTypeSchema = require('./counselorType').schema;
const HeadStaffTypeSchema = require('./headStaffType').schema;

const QuestionSchema = new Schema({
    content: {type:String, required: true},
    type: CounselorTypeSchema,
    byWho: HeadStaffTypeSchema,
    camp_id:String
});

module.exports = mongoose.model('Question',QuestionSchema);