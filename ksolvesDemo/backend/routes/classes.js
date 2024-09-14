const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Unit = require('../models/Unit');
const Session = require('../models/Session');
const Lecture = require('../models/Lecture');
const jwt = require('jsonwebtoken');

// Middleware to check authorization
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  jwt.verify(token,"ksolvesClassroom", (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
  console.log("okok")
};

router.post('/addclass', async (req, res) => {
  const { title,instructor,unit,content } = req.body;
  try {
      const newClass = new Class({ title, instructor, unit,content });
      await newClass.save();
      res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/updateclass', async (req, res) => {
    try {
      const { title, instructor, unit, content } = req.body;
  
      if (!unit) {
        return res.status(400).json({ error: 'Unit is required' });
      }
  
      const updatedClass = await Class.findOneAndUpdate(
        { unit },
        { title, instructor, content },
        { new: true } // Return the updated document
      );
  
      if (!updatedClass) {
        return res.status(404).json({ error: 'Class not found' });
      }
  
      res.status(200).json(updatedClass);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

router.delete('/deleteclass', async (req, res) => {
    try {
        console.log("SADddddddd")

        const { unit } = req.body; // Extract the unit from the request body 
        // Ensure unit is provided
        if (!unit) {
          return res.status(400).json({ error: 'Unit is required' });
        }
        // Find and delete the class by unit
        const result = await Class.findOneAndDelete({ unit });

        // If no class was found and deleted, send an error message
        if (!result) {
          return res.status(404).json({ error: 'Class not found' });
        }
        // Send a success response
        res.status(200).json({ message: 'Class successfully deleted' });
      } catch (err) {
        // Handle any errors
        res.status(400).json({ error: err.message });
      }
  });


router.get('/allclasses', async (req, res) => {
    try {
        const classDetail = await Class.find();
        res.json(classDetail);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


// router.get('/:id', async (req, res) => {
//   try {
//     console.log("class id")
//     const classDetail = await Class.findById(req.params.id)
//       .populate({
//         path: 'units',
//         populate: {
//           path: 'sessions',
//           populate: {
//             path: 'lectures',
//           },
//         },
//       })
//       .exec();
//     res.json(classDetail);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

module.exports = router;
