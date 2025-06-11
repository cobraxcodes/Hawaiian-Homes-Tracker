import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import logger from '../utils/logger.js'

const mongoURI = process.env.MONGO_URI || "mongodb+srv://cobraxcodes:<db_password>@hawaiian-homes-tracker.3z4iz2q.mongodb.net/?retryWrites=true&w=majority&appName=hawaiian-homes-tracker"

const connect = async () =>{
    try{
        await mongoose.connect(mongoURI)
        console.log(`Successfully connected to ${mongoose.connection.name} database`)
    }catch(error){
        logger.error(`Failed to connect to database`)
    }
}

const disconnect = async () =>{
    await mongoose.disconnect()
}

export {connect, disconnect}