import applications from "../models/model.js";

// USER PROCESS 
// SIGNUP
// LOGIN
// LOGOUT


// ~~~~~~~~ ROUTES LOGIC ~~~~~~~~~~
const getAll = async(req,res,next) =>{ // GET ALL LOGIC
    try{
        const allApplications = await applications.find()
        res.status(200).json({
            applications: allApplications
        })
    }catch(err){
        next(err)
    }

}

const getByName = async (req,res,next) =>{  // GET BY NAME LOGIC
    try{
        const applicationName = await applications.findOne({
             name: new RegExp(`^${req.params.name}$`, "i")
        })
    if(!applicationName){return res.status(404).send('No application found!')}
    res.status(200).json({
        applications: applicationName
    })
    }catch(err){    
        next(err)
    }

}

export {getAll, getByName}