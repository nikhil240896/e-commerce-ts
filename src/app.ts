import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import globalErrorHandler from './controllers/globalErrorHandler';

const app = express();

// Custom CORS setup (e.g., only allow specific origins)
const corsOptions = {
  origin: ['https://your-frontend-domain.com', 'http://localhost:3545'], 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the App!');
});

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

app.use(globalErrorHandler);

export default app;