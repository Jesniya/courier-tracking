const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.get('/history', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const userId = decoded.id;
    const sql = 'SELECT * FROM shipments WHERE user_id = ? ORDER BY created_at DESC';

    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    });
  });
});

module.exports = router;
