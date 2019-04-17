const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const evaluationCommentSchema = new Schema({
    date: Date,
    commenter: String,
    comment: String,
    type: String
});

module.exports = mongoose.model('EvaluationComment',evaluationCommentSchema);