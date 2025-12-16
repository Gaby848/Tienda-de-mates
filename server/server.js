import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import ProductManager from './utils/ProductManager.js';

const PORT = 3000; // Cambiado de 8080 a 3000
const httpServer = createServer(app);
const io = new Server(httpServer);

// Crear instancia de ProductManager
const productManager = new ProductManager();

// Configurar WebSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Manejar nuevo producto
    socket.on('newProduct', async (product) => {
        try {
            const newProduct = await productManager.addProduct({
                ...product,
                code: `CODE-${Date.now()}`,
                status: true,
                thumbnails: []
            });
            io.emit('productAdded', newProduct);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            socket.emit('error', { message: 'Error al agregar el producto' });
        }
    });

    // Manejar eliminación de producto
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            io.emit('productDeleted', productId);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            socket.emit('error', { message: 'Error al eliminar el producto' });
        }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor con manejo de errores mejorado
const server = httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 WebSocket corriendo en ws://localhost:${PORT}`);
});

// Manejar errores del servidor
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Error: El puerto ${PORT} ya está en uso.`);
        console.log('💡 Intenta con otro puerto o cierra la aplicación que lo está usando.');
    } else {
        console.error('❌ Error al iniciar el servidor:', error);
    }
    process.exit(1);
});

export { io };