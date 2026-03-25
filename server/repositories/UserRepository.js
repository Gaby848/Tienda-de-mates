import userDao from '../dao/UserDao.js';
import UserDTO from '../dto/UserDTO.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

class UserRepository {
    async createUser(userData) {
        try {
            const user = await userDao.create(userData);
            return UserDTO.fromUser(user);
        } catch (error) {
            throw new Error(`Error en UserRepository.createUser: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await userDao.findById(id);
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error en UserRepository.getUserById: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await userDao.findByEmail(email);
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error en UserRepository.getUserByEmail: ${error.message}`);
        }
    }

    async getAllUsers() {
        try {
            const users = await userDao.findAll();
            return UserDTO.fromUsers(users);
        } catch (error) {
            throw new Error(`Error en UserRepository.getAllUsers: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        try {
            const user = await userDao.update(id, userData);
            return UserDTO.fromUser(user);
        } catch (error) {
            throw new Error(`Error en UserRepository.updateUser: ${error.message}`);
        }
    }

    async deleteUser(id) {
        try {
            return await userDao.delete(id);
        } catch (error) {
            throw new Error(`Error en UserRepository.deleteUser: ${error.message}`);
        }
    }

    async validatePassword(email, password) {
        try {
            const user = await userDao.findByEmail(email);
            if (!user) {
                return null;
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            return isValidPassword ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error en UserRepository.validatePassword: ${error.message}`);
        }
    }

    async updatePassword(id, newPassword) {
        try {
            // Encriptar la nueva contraseña
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            return await userDao.updatePassword(id, hashedPassword);
        } catch (error) {
            throw new Error(`Error en UserRepository.updatePassword: ${error.message}`);
        }
    }

    async generatePasswordResetToken(email) {
        try {
            const user = await userDao.findByEmail(email);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Generar token único
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora

            await userDao.update(user._id, {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetPasswordExpires
            });

            return resetToken;
        } catch (error) {
            throw new Error(`Error en UserRepository.generatePasswordResetToken: ${error.message}`);
        }
    }

    async validatePasswordResetToken(token) {
        try {
            const user = await userDao.findByResetToken(token);
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error en UserRepository.validatePasswordResetToken: ${error.message}`);
        }
    }

    async clearPasswordResetToken(id) {
        try {
            await userDao.update(id, {
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined
            });
        } catch (error) {
            throw new Error(`Error en UserRepository.clearPasswordResetToken: ${error.message}`);
        }
    }

    async isPasswordDifferent(id, newPassword) {
        try {
            const user = await userDao.findById(id);
            if (!user) {
                return true; // Si no existe el usuario, consideramos que es diferente
            }

            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            return !isSamePassword; // Retornar true si es diferente
        } catch (error) {
            throw new Error(`Error en UserRepository.isPasswordDifferent: ${error.message}`);
        }
    }
}

export default new UserRepository();
