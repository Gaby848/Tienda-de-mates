import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/database.js';
import { config } from './config/config.js';
import Product from './models/Product.js';

const PORT = config.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer);


const startServer = async () => {
    try {
        
        await connectDB();

        
        io.on('connection', (socket) => {
            console.log('👤 Cliente conectado:', socket.id);

            
            socket.on('newProduct', async (product) => {
                try {
                    const newProduct = await Product.create({
                        ...product,
                        code: `CODE-${Date.now()}`,
                        status: true,
                        thumbnails: []
                    });
                    
                    io.emit('productAdded', newProduct.toObject());
                    console.log('✓ Producto agregado:', newProduct.title);
                } catch (error) {
                    console.error('Error al agregar producto:', error.message);
                    socket.emit('error', { message: 'Error al agregar el producto: ' + error.message });
                }
            });

            
            socket.on('deleteProduct', async (productId) => {
                try {
                    await Product.findByIdAndDelete(productId);
                    io.emit('productDeleted', productId);
                    console.log('✓ Producto eliminado:', productId);
                } catch (error) {
                    console.error('Error al eliminar producto:', error.message);
                    socket.emit('error', { message: 'Error al eliminar el producto: ' + error.message });
                }
            });

            
            socket.on('disconnect', () => {
                console.log('👤 Cliente desconectado:', socket.id);
            });
        });

        
        const server = httpServer.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📡 WebSocket corriendo en ws://localhost:${PORT}`);
            console.log(`🗄️  MongoDB: ${config.MONGODB.URI}`);
            console.log('='.repeat(50) + '\n');
        });

        
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Error: El puerto ${PORT} ya está en uso.`);
                console.log('💡 Intenta con otro puerto o cierra la aplicación que lo está usando.');
            } else {
                console.error('❌ Error al iniciar el servidor:', error);
            }
            process.exit(1);
        });

        
        process.on('SIGINT', async () => {
            console.log('\n\n👋 Cerrando el servidor...');
            await connectDB.disconnect();
            server.close(() => {
                console.log('✓ Servidor cerrado correctamente');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};


startServer();

export { io };
