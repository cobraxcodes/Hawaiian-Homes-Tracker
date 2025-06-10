import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {type: String, 
        required: true,
        minlength: 6,
        maxlength: 15,
        validate: {
            validator: function (value){
                return /^[A-Za-z]+$/.test(value)
            }
        },
        message: props => `Invalid username ${props.value}`
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 15,
        validate:{
            validator: function (value){
                return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
            },
            message: props => `Invalid password ${props.value}`
        }
    }
})

userSchema.pre('save', async function (next){
    this.password = await bcrypt.hash(this.password, 10)
    console.log(`Hashed password: ${this.password}`)
    next()
})

 const users = mongoose.model('User', userSchema)

export default users