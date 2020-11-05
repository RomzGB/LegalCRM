const express = require('express')
let router = express.Router()
const ClientModel = require('../models/client-model').ClientModel
const calendar = require('../passport-setup')
router.post('/newClient', (req, res)=>{
    var newClient = new ClientModel({name: req.body.clientName})
    newClient.save(function(err){
        if(err) console.log(err)
        console.log("saved")
    })
    ClientModel.find({}, function(err, docs){
        res.send(docs)
    })
})



router.post('/displayClients', (req, res)=>{
    ClientModel.find({}, function(err, docs){
          res.send(docs)})
        
    })


router.post('/deleteClient', (req, res)=>{
    ClientModel.deleteOne({name: req.body.clientName}, function (err) {
        if (err) return handleError(err);
        console.log('deleted' + req.body.clientName)
        res.send(`deleted client ${req.body.clientName}`)
    })
})
module.exports = router;
