const mongoose = require ('mongoose')

const applicantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    areaCode: {type: Number, required: true},
    applicationDate : {type: String, required: true},
    waitListPosition: {type: Number},
    zipCode: {type: String}

})

const applicants = mongoose.model('Applicant', applicantSchema)

module.exports = applicants
