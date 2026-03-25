import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import userRepository from '../repositories/UserRepository.js';
import cartRepository from '../repositories/CartRepository.js';
import UserDTO from '../dto/UserDTO.js';
import emailService from '../services/EmailService.js';

const router = Router();

// Registro de usuario
router.post('/register', passport.authenticate('register', { 
    session: false,
    failureRedirect: '/api/sessions/fail-register'
}), async (req, res) => {
    try {
        // Crear un carrito para el nuevo usuario
        const newCart = await cartRepository.createCart();
        
        // Asignar el carrito al usuario
        const updatedUser = await userRepository.updateUser(req.user._id, { cart: newCart._id });
        
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
            user: updatedUser,
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
        
        // Usar DTO para evitar información sensible
        const userDTO = UserDTO.fromUser(req.user);
        
        res.json({
            status: 'success',
            message: 'Login exitoso',
            user: userDTO,
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
        // Usar DTO para evitar información sensible
        const userDTO = UserDTO.fromUser(req.user);
        
        res.json({
            status: 'success',
            message: 'Usuario autenticado correctamente',
            user: userDTO
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

// Rutas de recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'El email es requerido'
            });
        }

        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            // Por seguridad, no revelamos si el email existe o no
            return res.json({
                status: 'success',
                message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña'
            });
        }

        // Generar token de recuperación
        const resetToken = await userRepository.generatePasswordResetToken(email);
        
        // Enviar email
        await emailService.sendPasswordResetEmail(email, resetToken);
        
        res.json({
            status: 'success',
            message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al procesar la solicitud',
            error: error.message
        });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'El token y la nueva contraseña son requeridos'
            });
        }

        // Validar token
        const user = await userRepository.validatePasswordResetToken(token);
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Token inválido o expirado'
            });
        }

        // Verificar que la nueva contraseña sea diferente a la anterior
        const isDifferent = await userRepository.isPasswordDifferent(user.id, newPassword);
        if (!isDifferent) {
            return res.status(400).json({
                status: 'error',
                message: 'La nueva contraseña no puede ser igual a la anterior'
            });
        }

        // Actualizar contraseña
        await userRepository.updatePassword(user.id, newPassword);
        
        // Limpiar token de reseteo
        await userRepository.clearPasswordResetToken(user.id);
        
        res.json({
            status: 'success',
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al restablecer contraseña',
            error: error.message
        });
    }
});

router.get('/validate-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const user = await userRepository.validatePasswordResetToken(token);
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Token inválido o expirado'
            });
        }
        
        res.json({
            status: 'success',
            message: 'Token válido'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al validar token',
            error: error.message
        });
    }
});

export default router;
