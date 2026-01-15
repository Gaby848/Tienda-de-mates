
async function updateCartBadge() {
    const cartId = localStorage.getItem('cartId');
    const badge = document.getElementById('cartBadge');
    
    if (!cartId || !badge) return;
    
    try {
        const response = await fetch(`/api/carts/${cartId}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.payload.products) {
            const totalItems = data.payload.products.length;
            
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error al actualizar badge del carrito:', error);
    }
}


async function getOrCreateCart() {
    
    let cartId = localStorage.getItem('cartId');
    
    if (!cartId) {
        
        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                cartId = data.payload._id;
                localStorage.setItem('cartId', cartId);
                console.log('✓ Carrito creado:', cartId);
                showToast('Carrito creado exitosamente', 'success');
                updateCartBadge();
                return cartId;
            } else {
                throw new Error(data.message || 'Error al crear carrito');
            }
        } catch (error) {
            console.error('Error al crear carrito:', error);
            showToast('Error al crear carrito', 'error');
            return null;
        }
    }
    
    return cartId;
}


async function addProductToCart(productId, productTitle) {
    try {
        const cartId = await getOrCreateCart();
        
        if (!cartId) {
            showToast('No se pudo crear el carrito', 'error');
            return;
        }
        
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: 1 })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            showToast(`"${productTitle}" agregado al carrito`, 'success');
            console.log('✓ Producto agregado al carrito');
            
            updateCartBadge();
        } else {
            showToast('Error: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        showToast('Error al agregar al carrito', 'error');
    }
}


function viewCart() {
    const cartId = localStorage.getItem('cartId');
    
    if (!cartId) {
        showToast('No tienes carrito creado', 'warning');
        return;
    }
    
    window.location.href = `/carts/${cartId}`;
}


document.addEventListener('DOMContentLoaded', () => {
    
    updateCartBadge();
    
    
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            const productTitle = e.target.getAttribute('data-product-title');
            await addProductToCart(productId, productTitle);
        }
    });
    
    
    const viewCartBtn = document.getElementById('viewCartBtn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', viewCart);
    }
    
    
    const cartLink = document.getElementById('cartLink');
    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            viewCart();
        });
    }
});
