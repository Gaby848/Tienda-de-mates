import Product from '../models/Product.js';

/**
 * Servicio de Productos
 * Maneja toda la lógica relacionada con productos incluyendo paginación, filtros y ordenamiento
 */
class ProductService {
    /**
     * Obtener productos con paginación, filtros y ordenamiento
     * @param {Object} options - Opciones de búsqueda
     * @param {number} options.limit - Número de productos por página (default: 10)
     * @param {number} options.page - Número de página (default: 1)
     * @param {string} options.query - Filtro por categoría o disponibilidad (default: null)
     * @param {string} options.sort - Ordenamiento por precio: 'asc' o 'desc' (default: null)
     * @returns {Promise<Object>} Objeto con productos y metadata de paginación
     */
    async getProducts(options = {}) {
        try {
            const limit = Math.max(1, parseInt(options.limit) || 10);
            const page = Math.max(1, parseInt(options.page) || 1);
            const query = options.query || null;
            const sort = options.sort || null;

            // Construir el filtro de búsqueda
            let filter = {};

            // Si hay un query, filtrar por categoría o disponibilidad
            if (query) {
                // Buscar por categoría (case-insensitive)
                filter = {
                    $or: [
                        { category: { $regex: query, $options: 'i' } },
                        { status: query === 'disponible' ? true : false }
                    ]
                };
            }

            // Calcular skip para la paginación
            const skip = (page - 1) * limit;

            // Construir objeto de ordenamiento
            let sortObj = {};
            if (sort === 'asc') {
                sortObj = { price: 1 };
            } else if (sort === 'desc') {
                sortObj = { price: -1 };
            }

            // Ejecutar la consulta
            const products = await Product.find(filter)
                .sort(sortObj)
                .limit(limit)
                .skip(skip)
                .lean();

            // Obtener el total de documentos que coinciden con el filtro
            const totalProducts = await Product.countDocuments(filter);

            // Calcular el número total de páginas
            const totalPages = Math.ceil(totalProducts / limit);

            // Calcular página anterior y siguiente
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;

            // Construir links
            const baseUrl = '/api/products';
            const buildLink = (pageNum) => {
                const params = new URLSearchParams();
                params.append('limit', limit);
                params.append('page', pageNum);
                if (query) params.append('query', query);
                if (sort) params.append('sort', sort);
                return `${baseUrl}?${params.toString()}`;
            };

            const prevLink = prevPage ? buildLink(prevPage) : null;
            const nextLink = nextPage ? buildLink(nextPage) : null;

            // Retornar objeto con formato solicitado
            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink,
                nextLink
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }

    /**
     * Obtener un producto por su ID
     * @param {string} id - ID del producto (MongoDB ObjectId)
     * @returns {Promise<Object>} Producto encontrado
     */
    async getProductById(id) {
        try {
            const product = await Product.findById(id).lean();
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Agregar un nuevo producto
     * @param {Object} productData - Datos del producto
     * @returns {Promise<Object>} Producto creado
     */
    async addProduct(productData) {
        try {
            // Validar que el código sea único
            const existingProduct = await Product.findOne({ code: productData.code });
            if (existingProduct) {
                throw new Error('El código del producto ya existe');
            }

            const product = new Product({
                title: productData.title,
                description: productData.description,
                code: productData.code,
                price: productData.price,
                stock: productData.stock || 0,
                category: productData.category,
                thumbnails: productData.thumbnails || [],
                status: productData.status !== false
            });

            await product.save();
            return product.toObject();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Actualizar un producto
     * @param {string} id - ID del producto
     * @param {Object} updateData - Datos a actualizar
     * @returns {Promise<Object>} Producto actualizado
     */
    async updateProduct(id, updateData) {
        try {
            // No permitir actualizar el código
            delete updateData.code;
            delete updateData._id;

            const product = await Product.findByIdAndUpdate(id, updateData, { new: true }).lean();
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Eliminar un producto
     * @param {string} id - ID del producto
     * @returns {Promise<Object>} Producto eliminado
     */
    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id).lean();
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new ProductService();
