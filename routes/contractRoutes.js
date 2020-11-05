const express = require('express')
let router = express.Router()
const ClientModel = require('../models/client-model').ClientModel


router.post('/displayContracts', (req, res)=>{
    ClientModel.findOne({name: req.body.clientName}, function(err, client){
        res.send(client.contracts)
    })
    //res.send("response from /displayContracts")
})


router.post('/addContract', (req,res)=>{
    ClientModel.findOne({name: req.body.clientName}, function(err, client){
        client.contracts.push({name: req.body.contractTitle})
        client.save()
        res.send(client.contracts)
    })
})


router.post('/deleteContract', (req, res)=>{
    console.log(req.body.clientName + "clientName")
    ClientModel.findOne({name: req.body.clientName}, function(err, client){
        console.log(client)
        client.contracts.pull(req.body.contractID)
        client.save()
        res.send(client.contracts)})
})
module.exports = router;