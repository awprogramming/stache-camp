const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SessionSchema = require('./session').schema;
const EvalOptsSchema = require('./evalOpts').schema;

const optionsSchema = new Schema({
    session:SessionSchema,
    evaluationOpts: EvalOptsSchema
});

module.exports = mongoose.model('Options',optionsSchema);