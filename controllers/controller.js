import applications from "../models/model.js";
import users from '../models/userSchema.js'
import {createToken} from '../utils/jwtUtils.js'
import bcrypt from 'bcrypt'
import client from "../utils/redis.js";
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
        // if password is valid, token is then given to user specifically tied to their username
           const token = createToken({username: user.name })
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
    //if no user return and send 401
    //send a response 200
    

// ~~~~~~~~ ROUTES LOGIC ~~~~~~~~~~
const getAll = async(req,res,next) =>{ // GET ALL INFORMATION LOGIC
    try{
          //await for client to get cached applications (it needs a str passed)
        const cachedApplications = await client.get('applications')
           // if there is cached apps then return using json.parse(cachedApps)
           if(cachedApplications){
            // add console log that 'applications' will be coming from caching
            console.log('Showing applications from cache')
            return res.json(JSON.parse(cachedApplications))
           }
            // if not, console that apps will be retrieved from db
            console.log('Retrieving applications from database')
              // then use .find
            const allApplications = await applications.find()
               // add the apps into the cache for 30 seconds using client.setEx( and stringify it)
               await client.setEx('applications', 30, JSON.stringify(allApplications))
                   // send results
               res.status(200).json({
                applications: allApplications
               })
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
            zipCode: req.body.zipCode ?? existingApp.zipCode 


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



 // EXPORTING LOGIC HERE
export {getAll, getLastName, getRanks, getZipCode, getByFullName, createApp, updateApp, deleteApp,signup, login, logout, deleteUser, loggedOutTokens}