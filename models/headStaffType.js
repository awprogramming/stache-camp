const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const headStaffTypeSchema = new Schema({
    type: {type:String, required: true}
});

module.exports = mongoose.model('HeadStaffType',headStaffTypeSchema);