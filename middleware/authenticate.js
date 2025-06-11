import {verifyToken} from '../utils/jwtUtils.js'
import {loggedOutTokens} from '../controllers/controller.js'

const authenticate = (req,res,next) =>{
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).send('Please provide a token!')
    }
    try{
        const decoded = verifyToken(token)
        if(!decoded)
            {return res.status(400).send('Unable to verify token!')}
       if(loggedOutTokens.includes(token)){
        res.status(401).json({
            message: "Token inactive! Please log in again!"
        })
    }
        req.user = decoded
        next()
    }catch(err){
        next(err)
}}

export default authenticate