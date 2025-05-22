const mongoose = require ('mongoose')

const applicantSchema = new mongoose.Schema({
    areaCode: {type: Number, required: true},
    name: {type: String, required: true},
    applicationDate : {type: Date, required: true},
    status: {type: String, required: false},
    waitListPosition: {type: Number, required: true}

})

const applicants = mongoose.model('Applicant', applicantSchema)

module.exports = applicants