const mongoose = require ('mongoose')

const applicationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    applicationDate : {type: Date, required: true},
    areaCode: {type: Number, required: true},
    waitListPosition: {type: Number},
    zipCode: {type: String}

})

const applications = mongoose.model('Applications', applicationSchema)

module.exports = applications
