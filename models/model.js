import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    applicationDate : {type: Date, required: true},
    rank: {type: Number, required: true},
    zipCode: {type: String}

})

const applications = mongoose.model('Applications', applicationSchema)

export default applications