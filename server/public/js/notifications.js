// Funciones para mostrar notificaciones
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.role = 'alert';
    notification.style.zIndex = '1050';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar la notificación después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Función para mostrar indicador de carga
export function showLoading(show = true) {
    let loadingElement = document.getElementById('loadingIndicator');
    
    if (show && !loadingElement) {
        loadingElement = document.createElement('div');
        loadingElement.id = 'loadingIndicator';
        loadingElement.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center';
        loadingElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
        loadingElement.style.zIndex = '1060';
        loadingElement.innerHTML = `
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        `;
        document.body.appendChild(loadingElement);
    } else if (!show && loadingElement) {
        loadingElement.remove();
    }
}
