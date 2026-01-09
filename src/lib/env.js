import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/mydatabase',
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};