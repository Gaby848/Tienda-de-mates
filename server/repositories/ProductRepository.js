import productDao from '../dao/ProductDao.js';
import ProductDTO from '../dto/ProductDTO.js';

class ProductRepository {
    async createProduct(productData) {
        try {
            const product = await productDao.create(productData);
            return ProductDTO.fromProduct(product);
        } catch (error) {
            throw new Error(`Error en ProductRepository.createProduct: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await productDao.findById(id);
            return product ? ProductDTO.fromProduct(product) : null;
        } catch (error) {
            throw new Error(`Error en ProductRepository.getProductById: ${error.message}`);
        }
    }

    async getProducts(query = {}, options = {}) {
        try {
            const result = await productDao.findAll(query, options);
            
            // Transformar los productos a DTOs
            result.payload = ProductDTO.fromProducts(result.payload);
            
            return result;
        } catch (error) {
            throw new Error(`Error en ProductRepository.getProducts: ${error.message}`);
        }
    }

    async updateProduct(id, productData) {
        try {
            const product = await productDao.update(id, productData);
            return ProductDTO.fromProduct(product);
        } catch (error) {
            throw new Error(`Error en ProductRepository.updateProduct: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            return await productDao.delete(id);
        } catch (error) {
            throw new Error(`Error en ProductRepository.deleteProduct: ${error.message}`);
        }
    }

    async getProductsByCategory(category) {
        try {
            const products = await productDao.findByCategory(category);
            return ProductDTO.fromProducts(products);
        } catch (error) {
            throw new Error(`Error en ProductRepository.getProductsByCategory: ${error.message}`);
        }
    }

    async getProductByCode(code) {
        try {
            const product = await productDao.findByCode(code);
            return product ? ProductDTO.fromProduct(product) : null;
        } catch (error) {
            throw new Error(`Error en ProductRepository.getProductByCode: ${error.message}`);
        }
    }

    async checkProductAvailability(productId, quantity) {
        try {
            const product = await productDao.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            if (product.stock < quantity) {
                throw new Error(`Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`);
            }

            return ProductDTO.fromProduct(product);
        } catch (error) {
            throw new Error(`Error en ProductRepository.checkProductAvailability: ${error.message}`);
        }
    }

    async reduceStock(productId, quantity) {
        try {
            const product = await productDao.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            if (product.stock < quantity) {
                throw new Error('Stock insuficiente');
            }

            product.stock -= quantity;
            await productDao.update(productId, { stock: product.stock });
            
            return ProductDTO.fromProduct(product);
        } catch (error) {
            throw new Error(`Error en ProductRepository.reduceStock: ${error.message}`);
        }
    }

    async increaseStock(productId, quantity) {
        try {
            const product = await productDao.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            product.stock += quantity;
            await productDao.update(productId, { stock: product.stock });
            
            return ProductDTO.fromProduct(product);
        } catch (error) {
            throw new Error(`Error en ProductRepository.increaseStock: ${error.message}`);
        }
    }
}

export default new ProductRepository();
