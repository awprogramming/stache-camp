const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: String,
    date: Date,
    tbd:Boolean,
    location: String,
    opponent: String,
    type: {type:String, enum:['game','trip','full-camp']},
    needsLunch: Boolean,
    specialty_id:String,
    division_id:String,
    division_ids:[String],
    roster_id: String,
    coach_ids:[String],
    ref_ids:[String],
    emailSent: {type: Boolean, default: false},
    notes:String
});

module.exports = mongoose.model('Event',eventSchema);