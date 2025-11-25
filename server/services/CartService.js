import CartManager from '../utils/CartManager.js';

class CartService {
    async createCart() {
        return await CartManager.createCart();
    }

    async getCartById(id) {
        return await CartManager.getCartById(id);
    }

    async addProductToCart(cartId, productId) {
        return await CartManager.addProductToCart(cartId, productId);
    }
}

export default new CartService();