import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    
    age: {
        type: Number,
        required: true,
        min: 0
    },
    
    password: {
        type: String,
        required: true
    },
    
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    
    resetPasswordExpires: {
        type: Date,
        default: undefined
    }
    
}, {
    timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', function(next) {
    // Solo encriptar si la contraseña ha sido modificada o es nueva
    if (!this.isModified('password')) return next();
    
    try {
        // Encriptar la contraseña con bcrypt.hashSync según requisito
        this.password = bcrypt.hashSync(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para eliminar la contraseña de la respuesta JSON
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;
