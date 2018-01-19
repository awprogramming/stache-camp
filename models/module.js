const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const CampSchema = require('./camp');


const moduleSchema = new Schema({
    formal: {type:String, required: true},
    short_name: {type:String, required: true},
    description: {type:String, required: true}
});

moduleSchema.pre('remove', function(next) {
    var self = this;
    
    self.model('Camp').update({modules:{$elemMatch:{_id:this._id}}},{$pull:{modules:{_id:this._id}}},{ multi: true },(err) => {
        console.log(err);
    });
    
    next();
});

module.exports = mongoose.model('Module',moduleSchema);