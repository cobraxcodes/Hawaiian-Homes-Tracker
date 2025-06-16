import limiter from './middleware/rate-limiter.js'
import cors from 'cors'
import helmet from 'helmet'
import {getAll,getLastName, getRanks, getZipCode, 
 getByFullName, createApp, updateApp, deleteApp,signup, login, logout, deleteUser} from './controllers/controller.js'
import express from 'express'
import morgan from 'morgan'
import logger from './utils/logger.js'
import {connect} from './database/database.js'
import authenticate from './middleware/authenticate.js'


const app = express() //creating express app
const port = process.env.PORT || 10000;; // setting port here

// no templating engine


// ~~~~ MIDDLEWARES ~~~~
app.use(async (req,res,next) =>{
    try{
       await limiter.consume(req.ip) // checks user IP address if rate limit quota has been reached
        // if not yet reached, proceed to next() middleware . if yes, move to catch block
        next()
    }catch(err){  // checkign err (contains the rate limiter response when the rate limit exceeds)
          if(err.remainingPoints <= 5){
        return res.status(429).send('Too Many Requests!')
    }
    next(err)
    }
})
app.use(cors())
app.use(helmet())
app.use(express.json()) 
app.use(morgan(':method: url| Status: :status | Time: :response-time ms| Date: :date[clf]'))

// ~~~~~~~~USING CONNECT FN TO CONNECT TO DATABASE ~~~~~~~

const start = async() =>{
    try{
        await connect()
        app.listen(port, () =>{
            console.log(`Server is listening on port ${port}`) // change later to a winston logger
        })
    }catch(error){
        logger.error(`Unable to connect to server, Error: ${error.message} \n Stack Trace: ${error.stack}`)
    }
}

start()

// ~~~~~~~ROUTES~~~~~~~

// USER ROUTES
app.post('/applications/signup', signup) // post route for user signup
app.post('/applications/login', login) // post route for user login 
app.post('/applications/logout', logout) // post route for logout
app.delete('/applications/user', deleteUser) //delete route to delete user




// READ ROUTES
app.get('/', getAll) // get all route
app.get('/applications/rank', getRanks) // get all ranks route
app.get('/applications/name/:fullname', getByFullName)
app.get('/applications/lastname/:lastname', getLastName) // get by last name
app.get('/applications/zipcode/:zipcode', getZipCode) // get route for zipcodes
// CREATE ROUTE
app.post('/applications/new', authenticate, createApp) // post route for creating an app - authenticate ok ✅
//UPDATE ROUTE
app.patch('/applications/:id', authenticate, updateApp) // updates an application  - authenticate ok ✅
// DELETE ROUTE
app.delete('/applications/:id', authenticate, deleteApp) // deletes an application - authenticate ok ✅


// ~~~~~~ GLOBAL ERROR HANDLER ~~~~~~~
app.use((err,req,res,next)=>{
    logger.error(`Something went wrong! Error: ${err.message} \n Stack Trace:${err.stack}`)
     res.status(500).send('Something went wrong! Please try again later!')
})