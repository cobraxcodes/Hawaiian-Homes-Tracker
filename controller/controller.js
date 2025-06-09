import applications from "../models/model.js";

// USER PROCESS 
// SIGNUP
// LOGIN
// LOGOUT


// ~~~~~~~~ ROUTES LOGIC ~~~~~~~~~~
const getAll = async(req,res,next) =>{ // GET ALL INFORMATION LOGIC
    try{
        const allApplications = await applications.find()
        res.status(200).json({
            applications: allApplications
        })
    }catch(err){
        next(err)
    }

}

const getRanks = async(req,res,next) =>{
    try{
        const allRanks = await applications.find({}, {name:1, rank:1, _id:0})
        res.status(200).json({
            applications: allRanks
        })
    }catch(err){
        next(err)
    }
}
const getLastName = async(req,res,next) => {
    try{
        const pattern = req.params.lastname.trim().replace(/[, ]+/g, '[,\\s]*');
        const regex = new RegExp(`^${pattern},`, 'i')
        const matches = await applications.find({
            name:regex
        })
        if(!matches.length){return res.status(404).send("No Applications Found!")}
        res.status(200).json({
            applications: matches
        })
    }catch(err){
         next(err)
    }
}

export {getAll, getLastName, getRanks}