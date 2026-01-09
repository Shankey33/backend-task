import express from 'express';

//Internal Imports
import { ENV } from './src/lib/env.js';
import connectDB from './src/config/db.js';
import regularRouter from './src/routes/regularRoutes.js';
import adminRouter from './src/routes/adminRoutes.js';
import {authenticate, authorize} from './src/middleware/Auth.js';
import cors from 'cors';

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JSON parse error handler (returns 400 instead of printing stack trace)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.warn('Invalid JSON received for', req.method, req.originalUrl);
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    next();
});

// Use official CORS middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));

// Simple request logger for debugging (DEV only)
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.debug(`[req] ${req.method} ${req.originalUrl}`);
    }
    next();
});


//Routes
app.use("/api", regularRouter);
app.use("/api/admin", authenticate, authorize, adminRouter);

app.get('/health', (_, res) => {
    res.send('Server is up and running!');
});



try{
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log(`Server is running on port http://${ENV.PORT}`);
    })
} catch(error){
    console.error("Failed to start the server:", error);
}