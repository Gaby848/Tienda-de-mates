import Product from '../models/Product.js';

class ProductDao {
    async create(productData) {
        try {
            const product = new Product(productData);
            return await product.save();
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            throw new Error(`Error al buscar producto por ID: ${error.message}`);
        }
    }

    async findAll(query = {}, options = {}) {
        try {
            const { limit = 10, page = 1, sort, query: searchQuery } = options;
            
            // Construir filtro de búsqueda
            const filter = {};
            
            if (searchQuery) {
                if (searchQuery.category) {
                    filter.category = searchQuery.category;
                }
                if (searchQuery.status !== undefined) {
                    filter.status = searchQuery.status === 'true';
                }
            }

            // Opciones de paginación
            const paginationOptions = {
                limit: parseInt(limit),
                page: parseInt(page),
                lean: true,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
            };

            const result = await Product.paginate(filter, paginationOptions);
            
            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                page: result.page,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
            };
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    async update(id, productData) {
        try {
            return await Product.findByIdAndUpdate(id, productData, { new: true });
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await Product.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    async findByCategory(category) {
        try {
            return await Product.find({ category, status: true });
        } catch (error) {
            throw new Error(`Error al buscar productos por categoría: ${error.message}`);
        }
    }

    async findByCode(code) {
        try {
            return await Product.findOne({ code });
        } catch (error) {
            throw new Error(`Error al buscar producto por código: ${error.message}`);
        }
    }
}

export default new ProductDao();
