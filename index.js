import express from 'express';
import mongoose from 'mongoose';
import cafeRouter from './routes/cafeRoutes.js';
import employeeRouter from './routes/employeeRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PW = process.env.MONGO_PW;

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PW}@cafeapp.i42jdqh.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/cafes', cafeRouter);
app.use('/employees', employeeRouter);

// Root endpoint (optional)
app.get('/', (req, res) => {
  res.send('Welcome to our application!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
