const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }));
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
const shipmentRoutes = require('./routes/shipments');
app.use('/api/shipments', shipmentRoutes);

