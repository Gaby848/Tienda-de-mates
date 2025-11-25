import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { FILES } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductManager {
    constructor() {
        this.path = resolve(__dirname, '..', FILES.PRODUCTS);
        this.products = [];
        this.initialize();
    }

    async initialize() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, JSON.stringify([], null, 2));
            } else {
                console.error('Error inicializando ProductManager:', error);
            }
        }
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error guardando en archivo:', error);
        }
    }

    async addProduct(product) {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Todos los campos son obligatorios');
        }

        const id = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
        
        this.products.push(newProduct);
        await this.saveToFile();
        return newProduct;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');

        const { id: _, ...rest } = updatedFields;
        this.products[index] = { ...this.products[index], ...rest };
        await this.saveToFile();
        return this.products[index];
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');

        const deletedProduct = this.products.splice(index, 1)[0];
        await this.saveToFile();
        return deletedProduct;
    }
}

export default new ProductManager();