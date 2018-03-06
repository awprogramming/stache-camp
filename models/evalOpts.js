const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const QuestionSchema = require('./question').schema;

const evalOptsSchema = new Schema({
    currentEval:{type:Number, default:1, required: true},
    furthestReached:{type:Number, default:1, required: true},
    perSession: {type:Number, default:3, required: true},
    low: {type:Number, default:0,required:true},
    high: {type:Number, default:5, required:true},
    questions:[QuestionSchema],
    gold: {type:Number, default:87,required:true},
    silver: {type:Number, default:78,required:true},
    green: {type:Number, default:67,required:true}
    
});

module.exports = mongoose.model('EvalOpts',evalOptsSchema);