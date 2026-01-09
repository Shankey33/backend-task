//Internal Imports
import { ENV } from './src/lib/env.js';
import connectDB from './src/config/db.js';
import express from 'express';


const app = express();

//Middleware
app.use(express.json());


//Routes
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