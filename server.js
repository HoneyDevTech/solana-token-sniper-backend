const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');


const app = express();
// const corsOptions = {
//   origin: 'http://localhost:8002',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

// Connect Database
connectDB();


// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Define Routes
app.use('/api/pairs', require('./routes/api/pairs'));


const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
