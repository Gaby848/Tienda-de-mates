import passport from 'passport';

// Middleware para verificar si el usuario está autenticado
export const authMiddleware = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error en la autenticación',
                error: err.message
            });
        }
        
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'No autorizado - Token inválido o ausente'
            });
        }
        
        req.user = user;
        next();
    })(req, res, next);
};

// Middleware para verificar si el usuario es admin
export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado - Se requiere rol de administrador'
        });
    }
    next();
};

// Middleware para verificar si el usuario es user o admin
export const userOrAdminMiddleware = (req, res, next) => {
    if (!['user', 'admin'].includes(req.user.role)) {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado - Rol no válido'
        });
    }
    next();
};
