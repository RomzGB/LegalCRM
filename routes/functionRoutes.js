const express = require('express')
let router = express.Router()
const ClientModel = require('../models/client-model').ClientModel
const path = require('path');

router.get('/clientFunctions.js', (req, res)=>{
    res.sendFile(path.join(dirName + '/functions/clientFunctions.js'));
})
router.get('/contractFunctions.js', (req, res)=>{
    res.sendFile(path.join(dirName + '/functions/contractFunctions.js'));
})
router.get('/assignmentFunctions.js', (req, res)=>{
    res.sendFile(path.join(dirName + '/functions/assignmentFunctions.js'));
})
router.get('/calendarAPI.js', (req, res)=>{
    res.sendFile(path.join(dirName + '/functions/calendarAPI.js'))
})


module.exports = router;