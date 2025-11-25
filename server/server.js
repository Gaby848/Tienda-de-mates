import app from './app.js';

const PORT = 8080;  // Puerto fijo a 8080

app.listen(PORT, () => {
    console.log(`🚀 Servidor de la Tienda de Mates corriendo en http://localhost:${PORT}`);
});