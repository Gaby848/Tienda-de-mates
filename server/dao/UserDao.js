import User from '../models/User.js';

class UserDao {
    async create(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            return await User.findById(id).populate('cart');
        } catch (error) {
            throw new Error(`Error al buscar usuario por ID: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ email }).populate('cart');
        } catch (error) {
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }

    async findAll() {
        try {
            return await User.find().select('-password').populate('cart');
        } catch (error) {
            throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
        }
    }

    async update(id, userData) {
        try {
            return await User.findByIdAndUpdate(id, userData, { new: true }).populate('cart');
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }

    async updatePassword(id, newPassword) {
        try {
            return await User.findByIdAndUpdate(id, { password: newPassword }, { new: true });
        } catch (error) {
            throw new Error(`Error al actualizar contraseña: ${error.message}`);
        }
    }

    async findByResetToken(token) {
        try {
            return await User.findOne({ 
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
        } catch (error) {
            throw new Error(`Error al buscar usuario por token de reset: ${error.message}`);
        }
    }
}

export default new UserDao();
