# 🔐 Sistema de Autenticación y Autorización

## 📋 Descripción

Este proyecto implementa un sistema completo de autenticación y autorización para la Tienda de Mates, utilizando Passport.js con estrategias Local y JWT.

## 🚀 Características Implementadas

### ✅ Modelo de Usuario
- **first_name**: String (requerido)
- **last_name**: String (requerido)
- **email**: String (único, requerido)
- **age**: Number (requerido)
- **password**: String (encriptado con bcrypt)
- **cart**: Referencia a Cart
- **role**: String ('user' o 'admin', default: 'user')

### ✅ Encriptación de Contraseña
- Utiliza `bcrypt` con `hashSync` para encriptar contraseñas
- Middleware automático en el modelo User
- Método `comparePassword` para validación

### ✅ Estrategias de Passport
- **'login'**: Autenticación local con email y contraseña
- **'register'**: Registro de nuevos usuarios
- **'jwt'**: Validación de tokens JWT
- **'current'**: Validación de usuario logueado

### ✅ Sistema de Login con JWT
- Generación de tokens JWT al hacer login
- Almacenamiento en cookies httpOnly
- Tiempo de expiración configurable
- Validación automática en rutas protegidas

### ✅ Endpoint /api/sessions/current
- Valida el token JWT del usuario
- Devuelve los datos completos del usuario
- Manejo de errores para tokens inválidos

## 📁 Archivos Creados

```
server/
├── models/
│   └── User.js                    # Modelo de usuario con encriptación
├── config/
│   └── passport.config.js         # Estrategias de Passport
├── middleware/
│   └── auth.middleware.js         # Middleware de autenticación
├── routes/
│   └── sessions.router.js         # Rutas de autenticación
└── scripts/
    └── testAuth.js               # Pruebas del sistema
```

## 🔧 Configuración

### Variables de Entorno
Agregar a tu archivo `.env`:
```env
JWT_SECRET=secret_key_jwt
JWT_COOKIE_EXPIRES=24h
```

### Dependencias Instaladas
```bash
npm install bcrypt passport passport-local passport-jwt jsonwebtoken
```

## 🛣️ Rutas de Autenticación

### POST /api/sessions/register
Registra un nuevo usuario y crea su carrito.

**Body:**
```json
{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@test.com",
    "age": 25,
    "password": "123456",
    "role": "user"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Usuario registrado exitosamente",
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/sessions/login
Inicia sesión de usuario.

**Body:**
```json
{
    "email": "juan@test.com",
    "password": "123456"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Login exitoso",
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/sessions/current
Valida y devuelve datos del usuario logueado.

**Headers:**
- Cookie: `jwt=token_jwt`

**Response:**
```json
{
    "status": "success",
    "message": "Usuario autenticado correctamente",
    "user": {
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan@test.com",
        "age": 25,
        "role": "user",
        "cart": "..."
    }
}
```

### POST /api/sessions/logout
Cierra sesión del usuario.

**Response:**
```json
{
    "status": "success",
    "message": "Logout exitoso"
}
```

## 🔒 Middleware de Protección

### authMiddleware
Protege rutas requiriendo autenticación JWT:
```javascript
import { authMiddleware } from '../middleware/auth.middleware.js';

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});
```

### adminMiddleware
Protege rutas para usuarios administradores:
```javascript
import { adminMiddleware } from '../middleware/auth.middleware.js';

router.delete('/users/:id', authMiddleware, adminMiddleware, (req, res) => {
    // Solo admins pueden acceder
});
```

## 🧪 Pruebas

### Ejecutar Pruebas Automáticas
```bash
# Asegúrate de que el servidor esté corriendo
npm run dev

# En otra terminal
node server/scripts/testAuth.js
```

### Pruebas Manuales con Postman
1. **Registrar usuario:**
   - POST `http://localhost:3000/api/sessions/register`
   - Body con datos del usuario

2. **Login:**
   - POST `http://localhost:3000/api/sessions/login`
   - Body con email y password

3. **Validar token:**
   - GET `http://localhost:3000/api/sessions/current`
   - Cookie con el token recibido

## 🔐 Seguridad

- **Contraseñas encriptadas** con bcrypt (10 salt rounds)
- **Tokens JWT** con firma y expiración
- **Cookies httpOnly** para protección XSS
- **Validación de inputs** en todos los endpoints
- **Manejo de errores** sin exponer información sensible

## 🚀 Uso en Producción

Para producción, asegúrate de:
1. Cambiar `JWT_SECRET` a un valor seguro
2. Usar `secure: true` en cookies (HTTPS)
3. Configurar CORS apropiadamente
4. Usar variables de entorno reales

## 📝 Ejemplos de Uso

### Proteger una ruta
```javascript
router.get('/mi-perfil', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Verificar rol
```javascript
router.post('/admin-action', authMiddleware, adminMiddleware, (req, res) => {
    // Solo usuarios con role 'admin' pueden acceder
    res.json({ message: 'Acción administrativa ejecutada' });
});
```

---

**✅ Todos los requisitos del curso están implementados y funcionando correctamente.**
