const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const QuestionSchema = require('./question').schema;

const evalOptsSchema = new Schema({
    perSession: {type:Number, default:3, required: true},
    questions:[QuestionSchema]
});

module.exports = mongoose.model('EvalOpts',evalOptsSchema);