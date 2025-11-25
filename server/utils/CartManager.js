import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from '../config/config.js';
const { FILES } = config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CartManager {
    constructor() {
        this.path = resolve(__dirname, '..', FILES.CARTS);
        this.carts = [];
        this.initialize();
    }

    async initialize() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
            } else {
                console.error('Error inicializando CartManager:', error);
            }
        }
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error guardando en archivo:', error);
        }
    }

    async createCart() {
        const id = this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
        const newCart = { id, products: [] };
        this.carts.push(newCart);
        await this.saveToFile();
        return newCart;
    }

    async getCartById(id) {
        const cart = this.carts.find(c => c.id === id);
        if (!cart) throw new Error('Carrito no encontrado');
        return cart;
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        const existingProduct = cart.products.find(p => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.saveToFile();
        return cart;
    }
}

export default new CartManager();