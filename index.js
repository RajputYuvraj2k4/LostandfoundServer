const express = require('express');
require('dotenv').config();
require('./Models/db'); // database connection
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');
const ContactRouter = require('./Routes/ContactRouter');
const ItemRouter = require('./Routes/ItemRouter');

const PORT = process.env.PORT || 8080;

const server = express();
server.use(cors()); // Enable CORS for the entire app
server.use(bodyParser.json());
server.use('/auth', AuthRouter);
server.use('/api', ContactRouter);
server.use('/api', ItemRouter); 

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});