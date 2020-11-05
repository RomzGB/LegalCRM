const express = require('express')
let router = express.Router()
const ClientModel = require('../models/client-model').ClientModel


router.post('/deleteAssignment', (req, res)=>{
    let indexOfContract, indexOfAssignment
    ClientModel.findOne({'contracts._id': req.body.contractID}, function (err, thisClient){
        thisClient.contracts.forEach((element, index, array)=>{
            if(element._id == req.body.contractID){
                indexOfContract = index
            }
        })
        thisClient.contracts[indexOfContract].assignments.forEach((element, index, array)=>{
            if(element._id == req.body.assignmentID){
                indexOfAssignment = index
            }
        })
        thisClient.contracts[indexOfContract].assignments.pull(req.body.assignmentID)
        thisClient.save(function(err){
            if(err) return handleError(err)
            console.log("removed assignment ", req.body.assignmentID, "from client ", thisClient)
        })
        res.send(thisClient)
    })
})

router.post('/displayAssignments', (req, res)=>{
    let indexOfContract
    ClientModel.findOne({'contracts._id': req.body.contractID}, function (err, thisClient){
        thisClient.contracts.forEach((element, index, array)=>{
            if(element._id == req.body.contractID){
                indexOfContract = index
            }
        })
        res.send(thisClient.contracts[indexOfContract].assignments)
    })
})
router.post('/addAssignment', (req, res)=>{
    let indexOfContract, indexOfAssignment
    ClientModel.findOne({'contracts._id': req.body.contractID}, function (err, thisClient){
        thisClient.contracts.forEach((element, index, array)=>{
            if(element._id == req.body.contractID){
                indexOfContract = index
            }
        })
        console.log(thisClient.contracts[indexOfContract])
        thisClient.contracts[indexOfContract].assignments.push({name: req.body.assignmentText, date: req.body.assignmentDate})
        thisClient.save()
        thisClient.contracts[indexOfContract].assignments.forEach((element, index, array)=>{
            if(element.name == req.body.assignmentText){
                indexOfAssignment = index
            }
        })
        res.send(thisClient.contracts[indexOfContract].assignments[indexOfAssignment]._id)
    })
})

router.post('/displayAllAssignments', (req, res)=>{
    ClientModel.find({}, function (err, clients){
        console.log(clients)
        res.send(clients)
    })
    
})

module.exports = router;