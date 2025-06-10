import {getAll,getLastName, getRanks, getZipCode, getByFullName, createApp, updateApp, deleteApp,signup, login} from './controllers/controller.js'
import express from 'express'
import morgan from 'morgan'
import logger from './utils/logger.js'
import {connect} from './database/database.js'

const app = express() //creating express app
const port = 4044;

// no templating engine

// ~~~~ MIDDLEWARES ~~~~
app.use(express.json()) 
app.use(morgan(':method: url| Status: :status | Time: :response-time ms| Date: :date[clf]'))

// ~~~~~~~~USING CONNECT FN TO CONNECT TO DATABASE ~~~~~~~
const start = async() =>{
    try{
        await connect()
        app.listen(port, ()=>{
            logger.info(`Server is listening on port ${port}`) // change later to a winston logger
        })
    }catch(error){
        logger.errored(`Unable to connect to server, Error: ${error.message} \n Stack Trace: ${error.stack}`)
    }
}

start()


// ~~~~~~~ROUTES~~~~~~~
// USER ROUTES
app.post('/applications/signup', signup) // post route for user signup
app.post('/applications/login', login) // post route for user login 




// READ ROUTES
app.get('/applications', getAll) // get all route
app.get('/applications/rank', getRanks) // get all ranks route
app.get('/applications/name/:fullname', getByFullName)
app.get('/applications/lastname/:lastname', getLastName) // get by last name
app.get('/applications/zipcode/:zipcode', getZipCode) // get route for zipcodes
// CREATE ROUTE
app.post('/applications/new', createApp) // post route for creating an app
//UPDATE ROUTE
app.patch('/applications/:id', updateApp) // updates an application 
// DELETE ROUTE
app.delete('/applications/:id', deleteApp)









// ~~~~~~ GLOBAL ERROR HANDLER ~~~~~~~
app.use((err,req,res,next)=>{
    logger.error(`Something went wrong! Error: ${err.message} \n Stack Trace:${err.stack}`)
     res.status(500).send('Something went wrong! Please try again later!')
})