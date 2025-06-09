import applications from "../models/model.js";

// USER PROCESS 
// SIGNUP
// LOGIN
// LOGOUT


// ~~~~~~~~ ROUTES LOGIC ~~~~~~~~~~
const getAll = async(req,res,next) =>{ // GET ALL INFORMATION LOGIC
    try{
        const allApplications = await applications.find() //using mongoose .find() too look up all docs in collection
        res.status(200).json({
            applications: allApplications
        })
    }catch(err){
        next(err)
    }

}

const getRanks = async(req,res,next) =>{ // GET ALL RANKS INCLUDING NAME 
    try{
        const allRanks = await applications.find({}, {name:1, rank:1, _id:0, zipCode: 1}) //passing a query what i want to be rendered form find.. 1 suggests to include , 0 is no
        res.status(200).json({
            applications: allRanks
        })
    }catch(err){
        next(err)
    }
}
const getLastName = async(req,res,next) => {
    try{
        const pattern = req.params.lastname.trim().replace(/[, ]+/g, '[,\\s]*'); // using .trim here to remove white space from beginning and end of string
        //  and replace commas or spaces with placeholder string
        const regex = new RegExp(`^${pattern},`, 'i')
        const matches = await applications.find({
            name:regex
        })
        if(!matches.length){return res.status(404).send("No Application Found!")}
        res.status(200).json({
            applications: matches
        })
    }catch(err){
         next(err)
    }
}

const getByFullName = async(req,res,next) =>{
    try{
        const findByFullName = await applications.findOne({
        name: new RegExp(`^${req.params.fullname}$`, "i") // querying with reg ex to make it case insensitve
    })
        if(!findByFullName){return res.status(404).send("No Application Found!")}

        res.status(200).json({
        applications: findByFullName
    })
    }catch(err){
        next(err)
    }
 
 
}


const getZipCode = async (req,res,next) =>{
    try{
        const findByZipCode = await applications.find({zipCode: req.params.zipcode})
        console.log(req.params.zipcode)
        if(findByZipCode.length === 0){return res.status(404).send(`No Applications Found For Zipcode: ${req.params.zipcode}`)} // return err if no zipcode provided
        
        res.status(200).json({
            applications: findByZipCode
        })
    }catch(err){
        next(err)
    }
}

// POST ROUTE
const createApp = async(req,res,next) =>{
    try{
      const newApp = new applications(req.body)
        const saveApp = newApp.save()

        res.status(200).json({
            message: "Application succesfully created!",
            applications: newApp
        })
    }catch(err){
        next(err)
    }
}








 // EXPORTING LOGIC HERE
export {getAll, getLastName, getRanks, getZipCode, getByFullName, createApp}