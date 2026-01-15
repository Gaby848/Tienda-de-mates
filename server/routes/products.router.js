import { Router } from 'express';
import productService from '../services/ProductService.js';

const router = Router();

/**
 * GET /api/products
 * Obtiene productos con paginación, filtros y ordenamiento
 * 
 * Query params:
 * - limit: número de productos por página (default: 10)
 * - page: número de página (default: 1)
 * - query: filtro por categoría o disponibilidad (default: null)
 * - sort: ordenamiento 'asc' o 'desc' por precio (default: null)
 * 
 * Respuesta:
 * {
 *   status: 'success' | 'error',
 *   payload: [...productos],
 *   totalPages: number,
 *   prevPage: number | null,
 *   nextPage: number | null,
 *   page: number,
 *   hasPrevPage: boolean,
 *   hasNextPage: boolean,
 *   prevLink: string | null,
 *   nextLink: string | null
 * }
 */
router.get('/', async (req, res) => {
    try {
        const { limit, page, query, sort } = req.query;
        
        const result = await productService.getProducts({
            limit,
            page,
            query,
            sort
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

/**
 * GET /api/products/:pid
 * Obtiene un producto específico por su ID
 */
router.get('/:pid', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        res.json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(404).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

/**
 * POST /api/products
 * Crea un nuevo producto
 * 
 * Body esperado:
 * {
 *   title: string,
 *   description: string,
 *   code: string (único),
 *   price: number,
 *   stock: number,
 *   category: string,
 *   thumbnails: string[],
 *   status: boolean
 * }
 */
router.post('/', async (req, res) => {
    try {
        const newProduct = await productService.addProduct(req.body);
        res.status(201).json({
            status: 'success',
            payload: newProduct
        });
    } catch (error) {
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

/**
 * PUT /api/products/:pid
 * Actualiza un producto existente
 * 
 * Body esperado:
 * {
 *   title?: string,
 *   description?: string,
 *   price?: number,
 *   stock?: number,
 *   category?: string,
 *   thumbnails?: string[],
 *   status?: boolean
 * }
 */
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.pid, req.body);
        res.json({
            status: 'success',
            payload: updatedProduct
        });
    } catch (error) {
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

/**
 * DELETE /api/products/:pid
 * Elimina un producto
 */
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProduct(req.params.pid);
        res.json({
            status: 'success',
            payload: deletedProduct
        });
    } catch (error) {
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

export default router;