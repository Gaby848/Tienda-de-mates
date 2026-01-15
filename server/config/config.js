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
    }
};