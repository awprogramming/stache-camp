const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const QuestionSchema = require('./question').schema;

const answerSchema = new Schema({
    question: QuestionSchema,
    question_id: String,
    numerical: {type:Number,default:0,required:true},
    text: {type:String,default:"",required:true},
    comment_ids:[String]
});

module.exports = mongoose.model('Answer',answerSchema);