import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

class CartDao {
    async create() {
        try {
            const cart = new Cart();
            return await cart.save();
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Cart.findById(id).populate('products.product');
        } catch (error) {
            throw new Error(`Error al buscar carrito por ID: ${error.message}`);
        }
    }

    async findAll() {
        try {
            return await Cart.find().populate('products.product');
        } catch (error) {
            throw new Error(`Error al obtener todos los carritos: ${error.message}`);
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            const product = await Product.findById(productId);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            if (product.stock < quantity) {
                throw new Error('Stock insuficiente');
            }

            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            // Actualizar stock del producto
            product.stock -= quantity;
            await product.save();

            return await cart.save();
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }

            const removedProduct = cart.products[productIndex];
            
            // Devolver stock al producto
            const product = await Product.findById(productId);
            if (product) {
                product.stock += removedProduct.quantity;
                await product.save();
            }

            cart.products.splice(productIndex, 1);
            return await cart.save();
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            const product = await Product.findById(productId);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            
            if (!existingProduct) {
                throw new Error('Producto no encontrado en el carrito');
            }

            // Calcular diferencia de stock
            const quantityDiff = quantity - existingProduct.quantity;
            
            if (product.stock < quantityDiff) {
                throw new Error('Stock insuficiente');
            }

            // Actualizar stock
            product.stock -= quantityDiff;
            await product.save();

            existingProduct.quantity = quantity;
            return await cart.save();
        } catch (error) {
            throw new Error(`Error al actualizar cantidad del producto: ${error.message}`);
        }
    }

    async clear(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            
            // Devolver stock de todos los productos
            for (const item of cart.products) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }

            cart.products = [];
            return await cart.save();
        } catch (error) {
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    }

    async getTotal(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            
            let total = 0;
            for (const item of cart.products) {
                total += item.product.price * item.quantity;
            }
            
            return total;
        } catch (error) {
            throw new Error(`Error al calcular total del carrito: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const cart = await Cart.findById(id);
            
            // Devolver stock de todos los productos antes de eliminar
            for (const item of cart.products) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }

            return await Cart.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar carrito: ${error.message}`);
        }
    }
}

export default new CartDao();
