import getAll from './controller/controller.js'
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
app.get('/applications', getAll)





// ~~~~~~ GLOBAL ERROR HANDLER ~~~~~~~
app.use((err,res,req,next)=>{
    logger.error(`Something went wrong! Error: ${err.message} \n Stack Trace:${err.stack}`)
    res.status(500).send('Something went wrong! Please try again later!')
})