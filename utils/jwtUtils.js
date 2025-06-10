import jwt from 'jsonwebtoken'
const secretKey = process.env.JWT_SECRET;

const createToken = payload =>{
    return jwt.sign(payload, secretKey)
}

const verifyToken = token =>{
    return jwt.verify(token, secretKey)
}

export {createToken, verifyToken}