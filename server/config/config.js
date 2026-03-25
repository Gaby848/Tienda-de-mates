import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const config = {
    
    PORT: process.env.PORT || 3000,
    
    
    FILES: {
        PRODUCTS: join(__dirname, '../data/products.json'),
        CARTS: join(__dirname, '../data/carts.json')
    },
    
    
    MONGODB: {
        
        URI: process.env.MONGO_URI || 'mongodb://localhost:27017/tienda-de-mates',
        
       
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    
    
    JWT: {
        SECRET: process.env.JWT_SECRET || 'secret_key_jwt',
        COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES || '24h'
    },
    
    EMAIL: {
        SERVICE: process.env.EMAIL_SERVICE || 'gmail',
        PORT: process.env.EMAIL_PORT || 587,
        USER: process.env.EMAIL_USER || '',
        PASSWORD: process.env.EMAIL_PASSWORD || ''
    },
    
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};