import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
const mongoURI = process.env.MONGO_URI || "mongodb+srv://cobraxcodes:<db_password>@hawaiian-homes-tracker.3z4iz2q.mongodb.net/?retryWrites=true&w=majority&appName=hawaiian-homes-tracker"

const connect = async () =>{
    try{
        await mongoose.connect(mongoURI)
        console.log(`Successfully connected to ${mongoose.connection.name} database`)
    }catch(error){
        console.log(`Failed to connect to database`)
    }
}

const disconnect = async () =>{
    await mongoose.disconnect()
}

module.exports = {connect, disconnect}