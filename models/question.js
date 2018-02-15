const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const CounselorTypeSchema = require('./counselorType').schema;


const QuestionSchema = new Schema({
    content: {type:String, required: true},
    type: CounselorTypeSchema
    
});

module.exports = mongoose.model('Question',QuestionSchema);