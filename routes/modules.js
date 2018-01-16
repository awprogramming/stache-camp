const Module = require('../models/module');
const config = require('../config/database');

module.exports = (router) => {
    router.post('/add_module',(req,res) => {
        console.log("modules.js");
        let mod = new Module({
            formal: req.body.formal,
            short_name: req.body.short_name,
            description: req.body.description
        });
            mod.save((err) => {
                res.json({
                    success:true,
                    message: "Module Registered!"
                });
        });
    });

    router.get('/all_modules',(req,res) =>{
        Module.find({},(err,modules) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(!modules){
                    res.json({success:false, message:'No modules registered'})
                }
                else{
                   res.json({succss:true,modules:modules});
                }
            }
        }).sort({'formal':1})
    });
    return router;
}