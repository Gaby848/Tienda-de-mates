import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductManager from './utils/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración de Handlebars
const hbs = engine({
    // Configuración de helpers
    helpers: {
        // Formatear números con separadores de miles y decimales
        numberFormat: function(number) {
            if (typeof number === 'number') {
                return number.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
            return number;
        },
        // Helper para comparaciones
        eq: function (a, b) { return a === b; },
        neq: function (a, b) { return a !== b; },
        lt: function (a, b) { return a < b; },
        gt: function (a, b) { return a > b; },
        lte: function (a, b) { return a <= b; },
        gte: function (a, b) { return a >= b; },
        // Helper para formatear fechas
        formatDate: function(date) {
            return new Date(date).toLocaleDateString('es-AR');
        }
    }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Instancia de ProductManager
const productManager = new ProductManager();

// Middleware para agregar variables globales a las vistas
app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    next();
});

// Ruta raíz
app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', {
            title: 'Inicio',
            products: products,
            currentYear: new Date().getFullYear()
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error al cargar la página de inicio',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Ruta para la vista en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', {
            title: 'Productos en Tiempo Real',
            products: products,
            currentYear: new Date().getFullYear()
        });
    } catch (error) {
        console.error('Error al cargar productos en tiempo real:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Error al cargar la vista de productos en tiempo real',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
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
