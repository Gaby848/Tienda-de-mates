import { Router } from 'express';
import productService from '../services/ProductService.js';
import cartService from '../services/CartService.js';

const router = Router();

/**
 * GET /products
 * Renderizar la vista de productos con paginación
 */
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;
        
        const result = await productService.getProducts({
            limit,
            page,
            query,
            sort
        });

        if (result.status === 'error') {
            return res.status(500).render('error', { 
                message: result.message 
            });
        }

        res.render('products', {
            payload: result.payload,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink
        });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Error al cargar los productos: ' + error.message 
        });
    }
});

/**
 * GET /products/:pid
 * Renderizar la vista de detalle de un producto
 */
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        
        res.render('product', {
            payload: product
        });
    } catch (error) {
        res.status(404).render('error', { 
            message: 'Producto no encontrado: ' + error.message 
        });
    }
});

/**
 * GET /carts/:cid
 * Renderizar la vista de un carrito específico
 */
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);
        
        res.render('carts', {
            payload: cart
        });
    } catch (error) {
        res.status(404).render('error', { 
            message: 'Carrito no encontrado: ' + error.message 
        });
    }
});

/**
 * GET /realTimeProducts
 * Renderizar la vista de productos en tiempo real con WebSocket
 */
router.get('/realTimeProducts', async (req, res) => {
    try {
        const result = await productService.getProducts({
            limit: 20,
            page: 1
        });

        if (result.status === 'error') {
            return res.status(500).render('error', { 
                message: result.message 
            });
        }

        res.render('realTimeProducts', {
            payload: result.payload
        });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Error al cargar productos en tiempo real: ' + error.message 
        });
    }
});

export default router;
