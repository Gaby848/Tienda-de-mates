import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
    PORT: 3000,
    FILES: {
        PRODUCTS: join(__dirname, '../data/products.json'),
        CARTS: join(__dirname, '../data/carts.json')
    }
};