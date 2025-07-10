import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    applicationDate : {type: Date, required: true},
    areaCode: {type: Number, required: true},
    rank: {type: Number, required: true},
    zipcode: {type: String}

})

const applications = mongoose.model('Applications', applicationSchema)

export default applications