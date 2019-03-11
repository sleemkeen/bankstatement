const express = require("express");
const router = express.Router();
const multer = require('multer');

router.get("/", (req, res, next) => {

  let response = 'Welcome to mybankstatement api';   
  res.status(200).json(response);
});



module.exports = router;
