const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SessionSchema = require('./session').schema;

const evalOptsSchema = new Schema({
    perSession: {type:Number, default:3, required: true},
    currentSession: SessionSchema,
    questions:[],
    // types


});

module.exports = mongoose.model('EvalOpts',evalOptsSchema);