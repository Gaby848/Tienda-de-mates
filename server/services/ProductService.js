import ProductManager from '../utils/ProductManager.js';

class ProductService {
    async getProducts() {
        return await ProductManager.getProducts();
    }

    async getProductById(id) {
        return await ProductManager.getProductById(id);
    }

    async addProduct(product) {
        return await ProductManager.addProduct(product);
    }

    async updateProduct(id, updatedFields) {
        return await ProductManager.updateProduct(id, updatedFields);
    }

    async deleteProduct(id) {
        return await ProductManager.deleteProduct(id);
    }
}

export default new ProductService();