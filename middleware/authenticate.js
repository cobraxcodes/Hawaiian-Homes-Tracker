import {verifyToken} from '../utils/jwtUtils'

const authenticate = (req,res,next) =>{
    const token = req.headers.authorization?.split('')[1]
    if(!token){
        return res.status(401).send('Please provide a token!')
    }
    try{
        const decoded = verifyToken(token)
        if(!decoded){return res.status(400).send('Unable to verify token!')}
        req.user = decoded
        next()
    }catch(err){
        next(err)
}}

export default authenticate