const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    skill: String,
    completed:Boolean,
    pdfLoc: {
        x:Number,
        y:Number
    }
});

module.exports = mongoose.model('Skill',skillSchema);