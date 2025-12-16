// Importar utilidades de notificación
import { showNotification, showLoading } from './notifications.js';

// Conectar al servidor de Socket.io
const socket = io();

// Referencias a elementos del DOM
const addProductForm = document.getElementById('addProductForm');
const realtimeProductsList = document.getElementById('realtimeProductsList');

// Validación de formulario
function validateProductForm(formData) {
    const errors = [];
    
    if (!formData.get('title') || formData.get('title').trim().length < 3) {
        errors.push('El título debe tener al menos 3 caracteres');
    }
    
    if (isNaN(parseFloat(formData.get('price'))) || parseFloat(formData.get('price')) <= 0) {
        errors.push('El precio debe ser un número mayor a 0');
    }
    
    if (isNaN(parseInt(formData.get('stock'))) || parseInt(formData.get('stock')) < 0) {
        errors.push('El stock debe ser un número positivo');
    }
    
    return errors;
}

// Manejar el envío del formulario
if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Mostrar indicador de carga
        showLoading(true);
        
        try {
            // Obtener los datos del formulario
            const formData = new FormData(addProductForm);
            
            // Validar el formulario
            const errors = validateProductForm(formData);
            
            if (errors.length > 0) {
                errors.forEach(error => showNotification(error, 'danger'));
                showLoading(false);
                return;
            }
            
            const product = {
                title: formData.get('title').trim(),
                description: formData.get('description').trim(),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock'), 10),
                code: `CODE-${Date.now()}`,
                status: true,
                category: 'general',
                thumbnails: []
            };

            // Emitir evento para agregar producto
            socket.emit('newProduct', product);
            
            // Mostrar notificación de éxito
            showNotification('Producto agregado correctamente', 'success');
            
            // Limpiar el formulario
            addProductForm.reset();
        } catch (error) {
            console.error('Error al procesar el formulario:', error);
            showNotification('Error al procesar el formulario', 'danger');
        } finally {
            showLoading(false);
        }
    });
}

// Manejar la eliminación de productos
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-product')) {
        const productId = e.target.getAttribute('data-id');
        const productTitle = e.target.closest('.card').querySelector('.card-title').textContent;
        
        // Usar SweetAlert2 para confirmación más amigable
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el producto "${productTitle}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        
        if (isConfirmed) {
            showLoading(true);
            try {
                socket.emit('deleteProduct', productId);
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                showNotification('Error al eliminar el producto', 'danger');
                showLoading(false);
            }
        }
    }
});

// Escuchar actualizaciones de productos
socket.on('productAdded', (product) => {
    // Actualizar la lista en tiempo real
    if (realtimeProductsList) {
        const productCard = `
            <div class="col-md-4 mb-4 product-card" data-id="${product.id}">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">Precio: $${product.price}</p>
                        <p class="card-text">Stock: ${product.stock}</p>
                        <button class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        realtimeProductsList.insertAdjacentHTML('beforeend', productCard);
    }
});

socket.on('productDeleted', (productId) => {
    // Eliminar el producto de la vista
    const productElement = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (productElement) {
        productElement.remove();
    }
});

// Función para formatear el precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(price);
}

// Cargar productos iniciales
window.addEventListener('DOMContentLoaded', async () => {
    showLoading(true);
    
    try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        
        const products = await response.json();
        
        // Actualizar la lista de productos en la página de inicio
        const productsList = document.getElementById('productsList');
        if (productsList) {
            if (products.length === 0) {
                productsList.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="alert alert-info">
                            No hay productos disponibles. ¡Agrega uno nuevo!
                        </div>
                    </div>`;
            } else {
                productsList.innerHTML = products.map(product => `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${product.title || 'Sin título'}</h5>
                                <p class="card-text flex-grow-1">${product.description || 'Sin descripción'}</p>
                                <p class="card-text"><strong>Precio:</strong> ${formatPrice(product.price || 0)}</p>
                                <p class="card-text"><strong>Stock:</strong> ${product.stock || 0} unidades</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        showNotification('Error al cargar los productos. Intenta recargar la página.', 'danger');
    } finally {
        showLoading(false);
    }
});

// Manejar errores de conexión WebSocket
socket.on('connect_error', () => {
    showNotification('Error de conexión con el servidor. Recargando...', 'danger');
    setTimeout(() => {
        window.location.reload();
    }, 3000);
});

// Manejar errores generales de la aplicación
window.addEventListener('unhandledrejection', (event) => {
    console.error('Error no manejado:', event.reason);
    showNotification('Ocurrió un error inesperado', 'danger');
});
