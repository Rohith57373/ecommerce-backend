const express = require('express');
const { createAorder, getOrderByEmail } = require('./order.controller');


const router = express.Router();

// create oder endpoint
router.post('/',createAorder);

// get order by  user email address
router.get("/email/:email",getOrderByEmail)


module.exports=router;