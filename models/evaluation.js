const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const AnswerSchema = require('./answer').schema;
const SessionSchema = require('./session').schema;

const evaluationSchema = new Schema({
    number: Number,
    session: SessionSchema,
    answers: [AnswerSchema],
    started: Boolean,
    submitted: Boolean,
    approved: Boolean,
    additional_notes:String
});

module.exports = mongoose.model('Evaluation',evaluationSchema);