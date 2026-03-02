import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import User from '../models/User.js';
import { config } from '../config/config.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Estrategia Local para login con email y contraseña
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Buscar usuario por email
        const user = await User.findOne({ email });
        
        // Si no existe el usuario
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        
        // Comparar contraseña
        const isMatch = await user.comparePassword(password);
        
        // Si la contraseña no coincide
        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        
        // Si todo está correcto
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Estrategia Local para registro
passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return done(null, false, { message: 'El email ya está registrado' });
        }
        
        // Crear nuevo usuario
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: email,
            age: req.body.age,
            password: password, // Se encriptará automáticamente en el middleware del modelo
            role: req.body.role || 'user'
        });
        
        // Guardar usuario en la base de datos
        await newUser.save();
        
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

// Estrategia JWT para proteger rutas
passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: config.JWT_SECRET || 'secret_key_jwt'
}, async (jwt_payload, done) => {
    try {
        // Buscar usuario por ID del payload
        const user = await User.findById(jwt_payload.id);
        
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Estrategia "current" para validar usuario logueado
passport.use('current', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: config.JWT_SECRET || 'secret_key_jwt'
}, async (jwt_payload, done) => {
    try {
        // Buscar usuario completo con sus datos
        const user = await User.findById(jwt_payload.id);
        
        if (!user) {
            return done(null, false, { message: 'Token inválido o usuario no encontrado' });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Función para extraer JWT de las cookies
function cookieExtractor(req) {
    let token = null;
    
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    
    return token;
}

export default passport;
