/**
 * Archivo de pruebas rápidas para verificar los endpoints
 * 
 * Uso: Abre la consola del navegador y copia/pega los comandos
 * O usa una herramienta como Postman o Insomnia
 */

// ==================== PRODUCTOS ====================

// 1. Obtener productos (sin filtros)
fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => console.log('Productos:', data));

// 2. Obtener productos con paginación
fetch('http://localhost:3000/api/products?page=1&limit=5')
    .then(res => res.json())
    .then(data => console.log('Página 1:', data));

// 3. Filtrar por categoría
fetch('http://localhost:3000/api/products?query=mates')
    .then(res => res.json())
    .then(data => console.log('Mates:', data));

// 4. Ordenar por precio
fetch('http://localhost:3000/api/products?sort=asc')
    .then(res => res.json())
    .then(data => console.log('Ordenado:', data));

// 5. Crear producto
fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Mate de Prueba',
        description: 'Mate de prueba para testing',
        code: 'TEST' + Date.now(),
        price: 1000,
        stock: 10,
        category: 'mates'
    })
})
.then(res => res.json())
.then(data => console.log('Producto creado:', data));

// ==================== CARRITOS ====================

// 1. Crear carrito
fetch('http://localhost:3000/api/carts', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
        console.log('Carrito creado:', data);
        console.log('Guarda este ID para usarlo después:', data.payload._id);
    });

// 2. Obtener carrito (reemplaza el ID)
fetch('http://localhost:3000/api/carts/TU_CART_ID_AQUI')
    .then(res => res.json())
    .then(data => console.log('Carrito:', data));

// 3. Agregar producto al carrito (necesitas IDs reales)
fetch('http://localhost:3000/api/carts/TU_CART_ID/products/TU_PRODUCT_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: 2 })
})
.then(res => res.json())
.then(data => console.log('Producto agregado:', data));

// 4. Actualizar cantidad
fetch('http://localhost:3000/api/carts/TU_CART_ID/products/TU_PRODUCT_ID', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: 5 })
})
.then(res => res.json())
.then(data => console.log('Cantidad actualizada:', data));

// 5. Eliminar producto del carrito
fetch('http://localhost:3000/api/carts/TU_CART_ID/products/TU_PRODUCT_ID', {
    method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log('Producto eliminado:', data));

// 6. Vaciar carrito
fetch('http://localhost:3000/api/carts/TU_CART_ID', {
    method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log('Carrito vaciado:', data));

// ==================== VISTAS ====================

// Navega en el navegador a:
// http://localhost:3000/products           - Ver todos los productos
// http://localhost:3000/products/:pid      - Ver detalle de un producto
// http://localhost:3000/carts/:cid         - Ver carrito específico

console.log('✅ Tests listos. Abre la consola para ver los resultados.');
