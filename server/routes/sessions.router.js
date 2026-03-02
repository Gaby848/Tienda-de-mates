import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';

const router = Router();

// Registro de usuario
router.post('/register', passport.authenticate('register', { 
    session: false,
    failureRedirect: '/api/sessions/fail-register'
}), async (req, res) => {
    try {
        // Crear un carrito para el nuevo usuario
        const newCart = new Cart();
        await newCart.save();
        
        // Asignar el carrito al usuario
        req.user.cart = newCart._id;
        await req.user.save();
        
        // Generar token JWT
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email, role: req.user.role },
            config.JWT.SECRET,
            { expiresIn: config.JWT.COOKIE_EXPIRES }
        );
        
        // Guardar token en cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, // En producción usar true con HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });
        
        res.status(201).json({
            status: 'success',
            message: 'Usuario registrado exitosamente',
            user: req.user,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
});

// Login de usuario
router.post('/login', passport.authenticate('login', {
    session: false,
    failureRedirect: '/api/sessions/fail-login'
}), async (req, res) => {
    try {
        // Generar token JWT
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email, role: req.user.role },
            config.JWT.SECRET,
            { expiresIn: config.JWT.COOKIE_EXPIRES }
        );
        
        // Guardar token en cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, // En producción usar true con HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });
        
        res.json({
            status: 'success',
            message: 'Login exitoso',
            user: req.user,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error en el login',
            error: error.message
        });
    }
});

// Endpoint para validar usuario logueado (estrategia "current")
router.get('/current', passport.authenticate('current', { 
    session: false 
}), (req, res) => {
    try {
        res.json({
            status: 'success',
            message: 'Usuario autenticado correctamente',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener datos del usuario',
            error: error.message
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    try {
        // Limpiar cookie
        res.clearCookie('jwt');
        
        res.json({
            status: 'success',
            message: 'Logout exitoso'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error en el logout',
            error: error.message
        });
    }
});

// Rutas de fallo
router.get('/fail-register', (req, res) => {
    res.status(400).json({
        status: 'error',
        message: 'Falló el registro del usuario'
    });
});

router.get('/fail-login', (req, res) => {
    res.status(400).json({
        status: 'error',
        message: 'Falló el login del usuario'
    });
});

export default router;
