import { Router } from 'express';
import cartService from '../services/CartService.js';

const router = Router();


router.post('/', async (req, res) => {
    try {
        const newCart = await cartService.createCart();
        res.status(201).json({
            status: 'success',
            payload: newCart
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});


router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(404).json({ 
            status: 'error',
            message: error.message 
        });
    }
});


router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity = 1 } = req.body;
        const cart = await cartService.addProductToCart(
            req.params.cid,
            req.params.pid,
            quantity
        );
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartService.removeProductFromCart(
            req.params.cid,
            req.params.pid
        );
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
});


router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (quantity === undefined || quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'La cantidad debe ser un número mayor a 0'
            });
        }

        const cart = await cartService.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            quantity
        );
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
});


router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({
                status: 'error',
                message: 'Debes enviar un array de productos'
            });
        }

        const cart = await cartService.updateAllCartProducts(req.params.cid, products);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
});


router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.params.cid);
        res.json({
            status: 'success',
            payload: cart,
            message: 'Carrito vaciado correctamente'
        });
    } catch (error) {
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

export default router;
