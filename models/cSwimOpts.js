const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const SessionSchema = require('./session').schema;
const SwimLevelSchema = require('./swimLevel').schema;

const cSwimOptsSchema = new Schema({
    currentLevel: SwimLevelSchema,
    completedLevels: [SwimLevelSchema],
    bracelet: {type:String, enum:['none','green','orange']},
    mostRecentReportSent: Date,
    sendReport: Boolean
});

module.exports = mongoose.model('CSwimOpts',cSwimOptsSchema);