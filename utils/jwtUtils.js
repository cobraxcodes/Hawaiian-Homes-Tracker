import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const secretKey = process.env.JWT_SECRET;

const createToken = payload =>{
    return jwt.sign(payload, secretKey)
}

const verifyToken = token =>{
    try{
         return jwt.verify(token, secretKey)
    }catch(err){
        return null
    }
}

export {createToken, verifyToken}