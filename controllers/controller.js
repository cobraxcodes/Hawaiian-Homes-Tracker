import userCreatedApplications from '../models/userCreatedApp.js'
import applications from "../models/model.js";
import users from '../models/userSchema.js'
import {createToken} from '../utils/jwtUtils.js'
import bcrypt from 'bcrypt'
// import client from "../utils/redis.js";
const loggedOutTokens = []

// ~~~~~~~ USER PROCESS ~~~~~~~~~
// SIGNUP
const signup = async (req,res,next) =>{
    try{
        const {username, password} = req.body
       if(!username || username.length < 6){
        return res.status(401).json({
            message: `Invalid username. Usernames must have at least 6 characters`
        })
       }
       if(!password || password.length < 8 ){
        return res.status(401).json({
            message: `Invalid password. Passwords must have at least 8 characters!`
        })
       }
       const existingUser = await users.findOne({username})
       if(existingUser){
        return res.status(400).json({
            message: `Username ${username} exists. Please try again!`
        })
       }
       const newUser = new users({username, password})
       await newUser.validate()
       const saveUser = await newUser.save()
       const token = createToken({username})
       res.status(201).json({
        message: "User created sucessfully!", token
       })
    }catch(err){
        next(err)
    }
}
// LOGIN
const login = async(req,res,next) =>{
    try{
        // destructure req body username and password
        const {username, password} = req.body
        // if  user does not exists return 401
        const user = await users.findOne({username})
        if(!user){
            return res.status(401).json({
                message: "Invalid Login! No user found!"
            })
        }
        //if username is there, take password and compare using bcrypt
        const authenticatePassword = await bcrypt.compare(password, user.password )
        // if passwords do not match, return 401 again
        if(!authenticatePassword){
            return res.status(401).json({message: 'Invalid password!'})
        }
        // if password is valid, token is then given with their username string insde the payload and userid 
           const token = createToken({userId: user._id, username: username })
    // send a response
        res.status(200).json({
            message: "Successful login!", token
        })
    }catch(err){
        next(err)
    }
}

// LOGOUT
 const logout = async (req,res,next) =>{
     // create logged out token array
    
    try{
        //get token
        const token = req.headers.authorization?.split(' ')[1]
         // push given token by user to logged out token
         if(loggedOutTokens.includes(token)){
            res.status(404).json({
                message: "Already logged out"
            })
         }
        loggedOutTokens.push(token)
        res.status(200).json({    
            //return sucessful logout
            message: "Logout successful!"
        })
    }catch(err){ 
        next(err)
    }
 }
   
// DELETE A USER
 
    const deleteUser = async (req,res,next) =>{
        try{
            // destructure username and password
            const {username, password} = req.body
            //check username if inside users db
            const user = await users.findOne({username})
               // if not, return w 401
            if(!user){return res.status(404).json({message: 'No User Found!'})}
              // if yes, proceed to check password
            const verifyPassword = await bcrypt.compare(password, user.password)
            // if password wrong, return 401
            if(!verifyPassword){return res.status(401).json({message: "Cannot verify password! Unable to delete account"})}
            // if all true delete user
            const deleteUser = await users.findOneAndDelete({username})
              // send res successful
            res.status(200).json({
                message: "Successfully deleted user!"
            })
        }catch(err){
            next(err)
        }
    }

    









// ~~~~~~~~ ROUTES LOGIC : LEGACY~~~~~~~~~~
const getAll = async(req,res,next) =>{ // GET ALL INFORMATION LOGIC
    try{
        // creating pagination to give prevent timeout due to big data set
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const skip = (page - 1) * limit 
            const allApplications = await applications.find()
            .skip(skip).limit(limit).select()
            const total = await applications.countDocuments()
            const responseData = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit),
                applications: allApplications
            }
                   // send results
               res.status(200).json(responseData)
    // same catch (err)
    }catch(err){
        next(err)
    }
    /// -- earlier version without caching ---
    // try{
    //     const allApplications = await applications.find() //using mongoose .find() too look up all docs in collection
    //     res.status(200).json({
    //         applications: allApplications
    //     })
    // }catch(err){
    //     next(err)
    // }

}

const getRank = async(req,res,next) =>{ // GET ALL RANKS INCLUDING NAME 
    try{
        const getByRank = await applications.find({rank: req.params.rank}) 
        if(getByRank.length === 0){return res.status(404).send(`No Applications Found For Rank: ${req.params.rank}`)}
        res.status(200).json({
            applications: getByRank
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

const getByFullName = async(req,res,next) =>{ // GET BY FULL NAME
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


const getZipCode = async (req,res,next) =>{ // GET BY ZIPCODE
    try{
        const findByZipCode = await applications.find({zipcode: req.params.zipcode})
        console.log(req.params.zipcode)
        if(findByZipCode.length === 0){return res.status(404).send(`No Applications Found For Zipcode: ${req.params.zipcode}`)} // return err if no zipcode provided
        
        res.status(200).json({
            applications: findByZipCode
        })
    }catch(err){
        next(err)
    }
}

const getAreaCode = async (req,res,next) =>{
    try{
        const findByAreaCode = await applications.find({areaCode: req.params.areacode})
        console.log(req.params.areacode)
        if(findByAreaCode.length === 0){return res.status(404).send(`No Applications Found For Area Code: ${req.params.areacode}`)}

        res.status(200).json({
            applications: findByAreaCode
        })
    }catch(err){
        next(err)
    }
}







// UPDATE ROUTE
const updateApp = async(req,res,next) =>{
    try{
        // get the app that needs updating
        const existingApp = await applications.findById(req.params.id)
        if(!existingApp){return res.status(200).json({message: "No Application Found!"})}
        const updateApp = await applications.findByIdAndUpdate({_id: req.params.id}, {
            name: req.body.name ?? existingApp.name,
            applicationDate: req.body.applicationDate ?? existingApp.applicationDate,
            rank: req.body.rank ?? existingApp.rank,
            zipcode: req.body.zipcode ?? existingApp.zipcode 


        }, {new: true, runValidators: true})
        res.status(200).json({
            message: `${existingApp.name} successfully updated!`,
            applications: updateApp
        })
    }catch(err){
        next(err)
    }
}


    // DELETE ROUTE
    const deleteApp = async (req,res,next) =>{
        try{

        const appDelete = await applications.findOneAndDelete({_id: req.params.id})
        if(!appDelete){return res.status(404).send("No Application Found!")}
        res.status(200).json({
            message: "Application Successfully Deleted!"
        })
        }catch(err){
            next(err)
        }
    }










    





// ~~~~~~~ CRUD OPERATIONS : NON LEGACY~~~~~~~~
// CREATE ROUTE - new apps non legacy 
const createApp = async (req, res, next) => {
  try {
    const newApp = new applications(req.body);
    if(req.body.name.length === 0){
        return res.status(400).json({message:"Please fill out all required fields!" })
    }
    if(req.body.applicationDate.length === 0){
          return res.status(400).json({message:"Please fill out all required fields!" })
    }
    if(req.body.areaCode.length === 0){
          return res.status(400).json({message:"Please fill out all required fields!" })
    }
    if(req.body.rank.length === 0){
          return res.status(400).json({message:"Please fill out all required fields!" })
    }
    if(req.body.zipcode.length === 0){
          return res.status(400).json({message:"Please fill out all required fields!" })
    }
    const savedApp = await newApp.save();

    // Save mapping
   const map = await userCreatedApplications.create({ // creates user created apps document in userCreatedApp box
      userId: req.user.userId, // ties in the applicaiton and id and user id for consistent mapping , so that even if jwt token changes
      applicationId: savedApp._id, // userid can be used for query to retrieve applicatiosn under it
    });

    res.status(200).json({
      message: "Application successfully created!",
      application: savedApp,
      userCreatedAppId: map._id
    });
  } catch (err) {
    next(err);
  }
};


// GET USER APPS - NON LEGACY - 
const getUserApps = async (req, res, next) => {
  try {
    const userAppMapping = await userCreatedApplications.find({ userId: req.user.userId });
    const appIds = userAppMapping.map(app => app.applicationId);

    const userApplications = await applications.find({ _id: { $in: appIds } });

    const applicationsWithId = userApplications.map(app => {
      // find the mapping object for this application
      const mapping = userAppMapping.find(link => link.applicationId.toString() === app._id.toString());

      return {
        ...app.toObject(),
        userCreatedApplicationId: mapping ? mapping._id : null
      };
    });

    res.status(200).json({
      applications: applicationsWithId
    });
  } catch (err) {
    next(err);
  }
};

// const createApp = async(req,res,next) =>{
//     try{
//       const newApp = new applications(req.body)
//         const saveApp = await newApp.save()
//         res.status(200).json({
//             message: "Application succesfully created!",
//             applications: saveApp
//         })
//     }catch(err){
//         next(err)
//     }
// }

// NON LEGACY UPDATE CONTROLLER 
const updateUserApp = async (req,res,next) =>{
    try{
        const mapUserCreatedApps = await userCreatedApplications.findById(req.params.id)
        if(!mapUserCreatedApps){
            return res.status(404).send('No applications found in non legacy app container')
        }
        const legacyContainer = await applications.findById(mapUserCreatedApps.applicationId)
        if(!legacyContainer){return res.status(404).send("No Applicatons found")}
        legacyContainer.name = req.body.name ?? legacyContainer.name
        legacyContainer.applicationDate = req.body.applicationDate ?? legacyContainer.applicationDate
        legacyContainer.areaCode = req.body.areaCode ?? legacyContainer.areaCode
        legacyContainer.rank = req.body.rank ?? legacyContainer.rank
        legacyContainer.zipcode = req.body.zipcode ?? legacyContainer.zipcode

        await legacyContainer.save()
        res.status(200).json({
            message: "Successfully updated application",
            application: legacyContainer,
            userCreatedAppId: mapUserCreatedApps._id
        })


    }catch(err){
        next(err)
    }
}


    // DELETE ROUTE - NON LEGACY APP
    const deleteUserCreatedApp = async (req,res,next) =>{
        try{
        const map = await userCreatedApplications.findById(req.params.id)
        const appDelete = await applications.findOneAndDelete({_id: map.applicationId})
        if(!appDelete){return res.status(404).send("No Application Found!")}
        res.status(200).json({
            message: "Application Successfully Deleted!"
        })
        }catch(err){
            next(err)
        }
    }



 // EXPORTING LOGIC HERE
export {getAll, getAreaCode, getLastName, getRank, getZipCode, getByFullName, createApp, updateApp, deleteApp,signup, login, logout, deleteUser, loggedOutTokens, getUserApps, updateUserApp, deleteUserCreatedApp}