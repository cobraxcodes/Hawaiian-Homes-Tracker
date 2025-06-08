import getAll from './controller/controller.js'
import express from 'express'
import morgan from 'morgan'
import winston from 'winston'
import {connect} from './database/database.js'

const app = express() //creating express app
const port = 5000;

// no templating engine

// ~~~~ MIDDLEWARES ~~~~
app.use(express.json()) 
app.use(morgan(':method: url| Status: :status | Time: :response-time-ms| Date: :date[clf]'))

// ~~~~~~~~USING CONNECT FN TO CONNECT TO DATABASE ~~~~~~~
const start = async() =>{
    try{
        await connect()
        app.listen(port, ()=>{
            console.log(`Server is listening on port ${port}`) // change later to a winston logger
        })
    }catch(error){
        console.log(`Unable to connect to server, Error: ${error.message} \n Stack Trace: ${error.stack}`)
    }
}

start()