const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const MedSchema = require('./med').schema;

const medsSchema = new Schema({
    epi: {type:Boolean,default:false,required:true},
    inhaler: {type:Boolean,default:false,required:true},
    other: [MedSchema]
});

module.exports = mongoose.model('Meds',medsSchema);