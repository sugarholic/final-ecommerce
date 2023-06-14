import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import collectionRoutes from './routes/collectionRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors';

const PORT = process.env.PORT || 8080; 

//env config
dotenv.config()

//database config
connectDB();

const app = express()

//middleware
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/collection', collectionRoutes);
app.use('/api/v1/product', productRoutes);

//rest api
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Parfum</h1>");
});

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} mode on port ${PORT}`)
});