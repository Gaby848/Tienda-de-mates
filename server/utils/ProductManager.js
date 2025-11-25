import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from '../config/config.js';
const { FILES } = config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductManager {
    constructor() {
        this.products = [];
        this.path = resolve(__dirname, '..', FILES.PRODUCTS);
        this.initialize();
    }

    async initialize() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, lo creamos con un array vacío
            if (error.code === 'ENOENT') {
                await this.saveToFile();
            } else {
                console.error('Error al inicializar ProductManager:', error);
            }
        }
    }

    async saveToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error);
            throw error;
        }
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async addProduct(product) {
        const newProduct = {
            id: Date.now().toString(),
            ...product,
            status: true,
            thumbnails: product.thumbnails || []
        };
        
        this.products.push(newProduct);
        await this.saveToFile();
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        
        this.products[index] = {
            ...this.products[index],
            ...updatedFields,
            id // Aseguramos que el ID no se modifique
        };
        
        await this.saveToFile();
        return this.products[index];
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        
        const [deletedProduct] = this.products.splice(index, 1);
        await this.saveToFile();
        return deletedProduct;
    }
}

export default new ProductManager();
