const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const otherDietarySchema = new Schema({
    name:String
});

module.exports = mongoose.model('OtherDietary',otherDietarySchema);