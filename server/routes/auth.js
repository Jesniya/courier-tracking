const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

// Signup Route

router.post('/signup', async (req, res) => {
    console.log("Signup route hit");
    const { username, email, password } = req.body;
    console.log("Body:", req.body);
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  
      db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("MySQL Error:", err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already registered' });
          }
          return res.status(500).json({ message: 'Signup failed', error: err });
        }
        console.log("✅ Signup: User saved to DB");
        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (err) {
      console.error("Hashing error:", err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Login route hit");
    console.log("Body:", req.body);
  
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' }); // ✅ return early
      }
  
      if (results.length === 0) {
        console.log("No user found");
        return res.status(401).json({ message: 'Invalid credentials' }); // ✅ return
      }
  
      const user = results[0];
  
      try {
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          console.log("Password doesn't match");
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
  
        console.log("Login successful");
        return res.json({ message: 'Login successful', token }); // ✅ SEND RESPONSE
      } catch (compareError) {
        console.error('Error comparing passwords:', compareError);
        return res.status(500).json({ error: 'Internal error' });
      }
    });
  });
  

module.exports = router;
