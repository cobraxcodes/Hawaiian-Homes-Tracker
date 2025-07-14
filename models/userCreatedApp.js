
import mongoose from "mongoose";

const userCreatedApp = new mongoose.Schema({
    userId: 
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    applicationId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Applications', required: true
    }
})

const userCreatedApplications = mongoose.model('UserCreatedApp', userCreatedApp)

export default userCreatedApplications