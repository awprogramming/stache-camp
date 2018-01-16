const Camp = require('../models/camp');
const config = require('../config/database');

module.exports = (router) => {
    router.get('/all_camps',(req,res) =>{
        Camp.find({},(err,camps) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(!camps){
                    res.json({success:false, message:'No camp registered'})
                }
                else{
                   res.json({succss:true,camps:camps});
                }
            }
        }).sort({'name':1})
    });
    return router;
}