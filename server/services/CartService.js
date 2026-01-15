import Cart from '../models/Cart.js';
import Product from '../models/Product.js';


class CartService {
    /**
     * Crear un nuevo carrito
     * @returns {Promise<Object>} Carrito creado
     */
    async createCart() {
        try {
            const cart = new Cart({
                products: []
            });
            await cart.save();
            return cart.toObject();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtener un carrito por su ID con productos "populados"
     * @param {string} cartId - ID del carrito (MongoDB ObjectId)
     * @returns {Promise<Object>} Carrito con productos completos
     */
    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product').lean();
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Agregar un producto al carrito
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto
     * @param {number} quantity - Cantidad a agregar (default: 1)
     * @returns {Promise<Object>} Carrito actualizado
     */
    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            
            const existingProductIndex = cart.products.findIndex(
                p => p.product.toString() === productId
            );

            if (existingProductIndex !== -1) {
                
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                
                cart.products.push({
                    product: productId,
                    quantity
                });
            }

            await cart.save();
            
            await cart.populate('products.product');
            return cart.toObject();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Eliminar un producto específico del carrito
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto a eliminar
     * @returns {Promise<Object>} Carrito actualizado
     */
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            
            cart.products = cart.products.filter(
                p => p.product.toString() !== productId
            );

            await cart.save();
            
            await cart.populate('products.product');
            return cart.toObject();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Actualizar solo la cantidad de un producto en el carrito
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto
     * @param {number} quantity - Nueva cantidad
     * @returns {Promise<Object>} Carrito actualizado
     */
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            if (quantity <= 0) {
                // Si la cantidad es 0 o negativa, eliminar el producto
                return await this.removeProductFromCart(cartId, productId);
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(
                p => p.product.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();
            
            await cart.populate('products.product');
            return cart.toObject();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Actualizar todos los productos del carrito
     * @param {string} cartId - ID del carrito
     * @param {Array} products - Array de productos con estructura {product: id, quantity: num}
     * @returns {Promise<Object>} Carrito actualizado
     */
    async updateAllCartProducts(cartId, products) {
        try {
            if (!Array.isArray(products)) {
                throw new Error('Los productos deben ser un array');
            }

            
            for (const item of products) {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Producto ${item.product} no encontrado`);
                }
                if (!item.quantity || item.quantity <= 0) {
                    throw new Error('Cada producto debe tener una cantidad válida (mayor a 0)');
                }
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = products;
            await cart.save();
            
            await cart.populate('products.product');
            return cart.toObject();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Vaciar el carrito (eliminar todos los productos)
     * @param {string} cartId - ID del carrito
     * @returns {Promise<Object>} Carrito vacío
     */
    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = [];
            await cart.save();
            return cart.toObject();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new CartService();
