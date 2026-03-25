import passport from 'passport';

// Middleware para verificar si el usuario está autenticado (usando estrategia current)
export const authMiddleware = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
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

// Middleware específico para productos - Solo admin puede crear, actualizar y eliminar
export const productAdminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        const method = req.method;
        let action = '';
        
        switch (method) {
            case 'POST':
                action = 'crear';
                break;
            case 'PUT':
                action = 'actualizar';
                break;
            case 'DELETE':
                action = 'eliminar';
                break;
        }
        
        return res.status(403).json({
            status: 'error',
            message: `Acceso denegado - Solo los administradores pueden ${action} productos`
        });
    }
    next();
};

// Middleware específico para carrito - Solo el usuario dueño puede modificar su carrito
export const cartOwnerMiddleware = (req, res, next) => {
    const userRole = req.user.role;
    const userId = req.user.id;
    const cartId = req.params.cid || req.params.id;
    
    // Los admins pueden acceder a cualquier carrito
    if (userRole === 'admin') {
        return next();
    }
    
    // Los usuarios solo pueden acceder a su propio carrito
    // Aquí asumimos que el ID del carrito del usuario está en req.user.cart
    if (req.user.cart && req.user.cart.toString() === cartId) {
        return next();
    }
    
    return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado - Solo puedes modificar tu propio carrito'
    });
};

// Middleware para verificar si el usuario puede agregar productos a su carrito
export const addToCartMiddleware = (req, res, next) => {
    const userRole = req.user.role;
    
    // Solo los usuarios pueden agregar productos a carritos
    if (userRole !== 'user') {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado - Solo los usuarios pueden agregar productos a su carrito'
        });
    }
    
    next();
};

// Middleware combinado para operaciones de productos
export const productAuthMiddleware = {
    create: [authMiddleware, productAdminMiddleware],
    read: [authMiddleware], // Todos los usuarios autenticados pueden leer
    update: [authMiddleware, productAdminMiddleware],
    delete: [authMiddleware, productAdminMiddleware]
};

// Middleware combinado para operaciones de carrito
export const cartAuthMiddleware = {
    read: [authMiddleware, cartOwnerMiddleware],
    addProduct: [authMiddleware, addToCartMiddleware, cartOwnerMiddleware],
    removeProduct: [authMiddleware, cartOwnerMiddleware],
    updateQuantity: [authMiddleware, cartOwnerMiddleware],
    clear: [authMiddleware, cartOwnerMiddleware],
    purchase: [authMiddleware, addToCartMiddleware, cartOwnerMiddleware]
};
