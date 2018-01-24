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
                   res.json({success:true,camps:camps});
                }
            }
        }).sort({'name':1})
    });

    router.get('/all_counselors',(req,res) =>{
        Camp.findOne({_id:req.decoded.campId},(err,camp) => {
            if(err){
                res.json({success:false,message:err});
            }
            else{
                if(!camp.counselors || camp.counselors.length == 0){
                    res.json({success:false, message:'No Counselors registered'})
                }
                else{
                   res.json({success:true,counselors:camp.counselors});
                }
            }
        });
    });

    router.post('/add_counselor',(req,res) => {
        Camp.update({"_id":req.decoded.campId},{$push:{counselors:req.body}}, (err, camp)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });

    router.delete('/remove_counselor/:id', (req, res) => {
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); 
        } else {

            Camp.findOneAndUpdate({'_id': req.decoded.campId},{$pull:{counselors:{_id:req.params.id}}},(err)=>{
                if(err){
                    res.json({ success: false, message: 'Failed to delete' });
                }
                else{
                    res.json({ success: true, message: 'Counselor deleted!' }); 
                }
            });

        //   Camp.findOne({'_id': req.decoded.campId}, (err, camp)=>{
        //     if (err) {
        //         res.json({ success: false, message: err }); 
        //     }
        //     camp.update({counselors:{_id:req.params.id}},{$pull:{counselors:{_id:req.params.id}}}, (err) => {
        //         if(err){
        //             res.json({ success: false, message: 'Failed to delete' });
        //         }
        //         else{
        //             res.json({ success: true, message: 'Counselor deleted!' }); 
        //         }
        //     });
        //   }
        // );
        }
      });

    router.post('/activate_module',(req,res) =>{
        Camp.update({"_id":req.body._id},{$push:{modules:req.body.toAdd}}, (err)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true});
            }
        });
    });
    
    return router;
}