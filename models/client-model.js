const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
    name: String,
    date: Date
})
const contractSchema = new mongoose.Schema({
    name: String,
    assignments: [assignmentSchema]
})

const clientSchema = new mongoose.Schema({
    name: String,
    contracts: [contractSchema]
})

const ClientModel = mongoose.model('Client', clientSchema)



module.exports = {ClientModel}