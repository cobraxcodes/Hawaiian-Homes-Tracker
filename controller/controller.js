import applications from "../models/model.js";

// USER PROCESS 
// SIGNUP
// LOGIN
// LOGOUT


// ~~~~~~~~ ROUTES LOGIC ~~~~~~~~~~
exports.getAll = async(req,res,next) =>{
    try{
        const allApplications = await applications.find()
        res.status(200).json({
            applications: allApplications
        })
    }catch(err){
        next(err)
    }

}