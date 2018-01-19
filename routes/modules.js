const Module = require('../models/module');
const config = require('../config/database');

module.exports = (router) => {
    router.post('/add_module',(req,res) => {
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

    router.delete('/remove_module/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {
          Module.findOne({'_id': req.params.id}, (err, mod)=>{
            if (err) {
                res.json({ success: false, message: err }); 
            } 
            mod.remove((err, mod) => {
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'Module deleted!' }); 
                }
            });
          }
        );
        }
      });

    return router;
}