const express = require("express");
const router = express.Router();
const multer = require('multer');

var db = require('../models/database');
  let fs = require('fs');
PDFParser = require("pdf2json");
 

let pdfParser = new PDFParser();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  // console.log(file.mimetype);
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


router.get("/", (req, res, next) => {
  const queryString = "SELECT * FROM users";
  db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      throw err
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return {firstName: row.firstname, lastName: row.lastname, email: row.email}
    })

    res.json(users)
  })
});

router.post("/", upload.single('productImage'), (req, res, next) => {
  
 
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile("./uploads/output.txt", pdfParser.getRawTextContent());
    });

    pdfParser.loadPDF("./uploads/renovate.pdf");
 


  const queryString = "INSERT INTO statements (bank, accountno, filepath, filename) VALUES ?";
  var values = [  
     [req.body.bank, req.body.accountno, req.file.path, req.file.filename],   
  ];
  db.query(queryString, [values], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      throw err
    }

    
    const success = {
      'status': 'File inserted successfully',
      'code':200
    }

    res.json(success);

  })
  
});





module.exports = router;
