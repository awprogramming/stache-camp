const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const QuestionSchema = require('./question').schema;

const answerSchema = new Schema({
    question: QuestionSchema,
    numerical: {type:Number,default:0,required:true},
    text: {type:String,default:"",required:true}
});

module.exports = mongoose.model('Answer',answerSchema);