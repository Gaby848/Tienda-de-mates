import cartDao from '../dao/CartDao.js';
import productRepository from './ProductRepository.js';

class CartRepository {
    async createCart() {
        try {
            return await cartDao.create();
        } catch (error) {
            throw new Error(`Error en CartRepository.createCart: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            return await cartDao.findById(id);
        } catch (error) {
            throw new Error(`Error en CartRepository.getCartById: ${error.message}`);
        }
    }

    async getAllCarts() {
        try {
            return await cartDao.findAll();
        } catch (error) {
            throw new Error(`Error en CartRepository.getAllCarts: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            // Verificar disponibilidad del producto
            await productRepository.checkProductAvailability(productId, quantity);
            
            return await cartDao.addProduct(cartId, productId, quantity);
        } catch (error) {
            throw new Error(`Error en CartRepository.addProductToCart: ${error.message}`);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            return await cartDao.removeProduct(cartId, productId);
        } catch (error) {
            throw new Error(`Error en CartRepository.removeProductFromCart: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            // Verificar disponibilidad del producto
            await productRepository.checkProductAvailability(productId, quantity);
            
            return await cartDao.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            throw new Error(`Error en CartRepository.updateProductQuantity: ${error.message}`);
        }
    }

    async clearCart(cartId) {
        try {
            return await cartDao.clear(cartId);
        } catch (error) {
            throw new Error(`Error en CartRepository.clearCart: ${error.message}`);
        }
    }

    async getCartTotal(cartId) {
        try {
            return await cartDao.getTotal(cartId);
        } catch (error) {
            throw new Error(`Error en CartRepository.getCartTotal: ${error.message}`);
        }
    }

    async deleteCart(id) {
        try {
            return await cartDao.delete(id);
        } catch (error) {
            throw new Error(`Error en CartRepository.deleteCart: ${error.message}`);
        }
    }

    async purchaseCart(cartId, userId) {
        try {
            const cart = await cartDao.findById(cartId);
            
            if (!cart || cart.products.length === 0) {
                throw new Error('Carrito vacío o no encontrado');
            }

            // Verificar stock de todos los productos
            for (const item of cart.products) {
                await productRepository.checkProductAvailability(item.product._id, item.quantity);
            }

            // Calcular total
            const total = await this.getCartTotal(cartId);

            // Crear array de productos para el ticket
            const ticketProducts = cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
                subtotal: item.product.price * item.quantity
            }));

            return {
                cart,
                total,
                products: ticketProducts
            };
        } catch (error) {
            throw new Error(`Error en CartRepository.purchaseCart: ${error.message}`);
        }
    }

    async confirmPurchase(cartId, userId) {
        try {
            const purchaseData = await this.purchaseCart(cartId, userId);
            
            // Vaciar el carrito después de la compra
            await cartDao.clear(cartId);
            
            return purchaseData;
        } catch (error) {
            throw new Error(`Error en CartRepository.confirmPurchase: ${error.message}`);
        }
    }
}

export default new CartRepository();
