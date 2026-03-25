import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { engine } from 'express-handlebars';
import passport from 'passport';
import './config/passport.config.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import ticketsRouter from './routes/tickets.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


const hbs = engine({
    
    helpers: {
        
        numberFormat: function(number) {
            if (typeof number === 'number') {
                return number.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
            return number;
        },
        
        eq: function (a, b) { return a === b; },
        neq: function (a, b) { return a !== b; },
        lt: function (a, b) { return a < b; },
        gt: function (a, b) { return a > b; },
        lte: function (a, b) { return a <= b; },
        gte: function (a, b) { return a >= b; },
        
        formatDate: function(date) {
            return new Date(date).toLocaleDateString('es-AR');
        },
        
        multiply: function(a, b) {
            return a * b;
        },
        
        subtotal: function(products) {
            if (!Array.isArray(products)) return 0;
            return products.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0).toFixed(2);
        },
        
        range: function(start, end) {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        },
        
        math: function(value, operand, operator) {
            switch(operator) {
                case 'add':
                case '+':
                    return value + operand;
                case 'subtract':
                case '-':
                    return value - operand;
                case 'multiply':
                case '*':
                    return value * operand;
                case 'divide':
                case '/':
                    return value / operand;
                default:
                    return value;
            }
        }
    }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Inicializar Passport
app.use(passport.initialize());


app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    next();
});


app.get('/', (req, res) => {
    res.render('home', {
        title: 'Tienda de Mates - Inicio',
        currentYear: new Date().getFullYear()
    });
});


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/tickets', ticketsRouter);


app.use('/', viewsRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '¡Algo salió mal!' });
});

export default app;
