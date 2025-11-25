import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: '¡Bienvenido a la API de la Tienda de Mates!',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        },
        documentation: 'Consulta la documentación para más información sobre cómo usar la API.'
    });
});

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '¡Algo salió mal!' });
});

export default app;