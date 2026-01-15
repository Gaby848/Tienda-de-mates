import mongoose from 'mongoose';
import { config } from './config.js';

/**
 * Conectar a la base de datos MongoDB
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
    try {
        
        await mongoose.connect(config.MONGODB.URI, config.MONGODB.options);
        console.log('✓ Conectado a MongoDB exitosamente');
    } catch (error) {
        console.error('✗ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

/**
 * Desconectar de la base de datos MongoDB
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('✓ Desconectado de MongoDB');
    } catch (error) {
        console.error('✗ Error al desconectar de MongoDB:', error.message);
    }
};

export default mongoose;
