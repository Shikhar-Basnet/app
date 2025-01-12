import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db } from './models/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);       // Authentication routes
app.use('/admin', adminRoutes);     // Admin routes
app.use('/user', userRoutes);       // User routes

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the backend!' });
  });

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
