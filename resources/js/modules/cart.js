// Cart Management Module

class CartManager {
    constructor() {
        this.cartCount = 0;
        this.cartItems = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartDisplay();
    }

    bindEvents() {
        // Add to cart button
        $(document).on('click', '.add-to-cart-btn', (e) => {
            e.preventDefault();
            this.addToCart($(e.currentTarget));
        });

        // Remove from cart button
        $(document).on('click', '.remove-from-cart', (e) => {
            e.preventDefault();
            this.removeFromCart($(e.currentTarget).data('item-id'));
        });

        // Update quantity
        $(document).on('change', '.cart-quantity', (e) => {
            this.updateQuantity($(e.currentTarget));
        });

        // Clear cart
        $(document).on('click', '.clear-cart', (e) => {
            e.preventDefault();
            this.clearCart();
        });
    }

    async addToCart(button) {
        const form = button.closest('form');
        const formData = new FormData(form[0]);
        
        // Show loading state
        button.prop('disabled', true).html(
            '<span class="spinner-border spinner-border-sm me-2"></span>Adding...'
        );

        try {
            const response = await fetch('/order/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pizzaId: formData.get('pizzaId'),
                    size: formData.get('size'),
                    quantity: formData.get('quantity'),
                    toppings: formData.getAll('toppings')
                })
            });

            const data = await response.json();

            if (data.success) {
                this.cartCount = data.cartCount;
                this.updateCartDisplay();
                this.showNotification('Item added to cart!', 'success');
                
                // Close modal if open
                const modal = bootstrap.Modal.getInstance(document.querySelector('.modal.show'));
                if (modal) {
                    modal.hide();
                }
            } else {
                this.showNotification(data.error || 'Failed to add item to cart', 'error');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showNotification('Failed to add item to cart', 'error');
        } finally {
            button.prop('disabled', false).html('<i class="fas fa-cart-plus me-2"></i>Add to Cart');
        }
    }

    async removeFromCart(itemId) {
        if (!confirm('Are you sure you want to remove this item?')) {
            return;
        }

        try {
            const response = await fetch(`/order/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.success) {
                this.cartCount = data.cartCount;
                this.updateCartDisplay();
                this.showNotification('Item removed from cart!', 'success');
                
                // Remove item from DOM
                $(`.cart-item[data-item-id="${itemId}"]`).fadeOut(300, function() {
                    $(this).remove();
                    // Recalculate totals
                    cart.calculateTotals();
                });
            } else {
                this.showNotification(data.error || 'Failed to remove item', 'error');
            }
        } catch (error) {
            console.error('Remove from cart error:', error);
            this.showNotification('Failed to remove item', 'error');
        }
    }

    async updateQuantity(input) {
        const itemId = input.data('item-id');
        const quantity = parseInt(input.val());
        
        if (quantity < 1) {
            input.val(1);
            return;
        }

        try {
            const response = await fetch(`/order/cart/${itemId}/quantity`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity })
            });

            const data = await response.json();

            if (data.success) {
                this.calculateTotals();
                this.showNotification('Quantity updated!', 'success');
            } else {
                this.showNotification(data.error || 'Failed to update quantity', 'error');
                // Revert to previous value
                input.val(input.data('previous-value') || 1);
            }
        } catch (error) {
            console.error('Update quantity error:', error);
            this.showNotification('Failed to update quantity', 'error');
            input.val(input.data('previous-value') || 1);
        }
    }

    async clearCart() {
        if (!confirm('Are you sure you want to clear your cart?')) {
            return;
        }

        try {
            const response = await fetch('/order/cart/clear', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.success) {
                this.cartCount = 0;
                this.cartItems = [];
                this.updateCartDisplay();
                this.showNotification('Cart cleared!', 'success');
                
                // Reload page or update DOM
                if (window.location.pathname.includes('/cart')) {
                    location.reload();
                }
            } else {
                this.showNotification(data.error || 'Failed to clear cart', 'error');
            }
        } catch (error) {
            console.error('Clear cart error:', error);
            this.showNotification('Failed to clear cart', 'error');
        }
    }

    updateCartDisplay() {
        // Update cart counter in navbar
        $('.cart-count').text(this.cartCount);
        
        // Add animation to cart icon
        $('.cart-icon').addClass('bounce');
        setTimeout(() => {
            $('.cart-icon').removeClass('bounce');
        }, 600);

        // Update cart badge visibility
        if (this.cartCount > 0) {
            $('.cart-badge').show();
        } else {
            $('.cart-badge').hide();
        }
    }

    calculateTotals() {
        let subtotal = 0;
        
        $('.cart-item').each(function() {
            const quantity = parseInt($(this).find('.cart-quantity').val());
            const price = parseFloat($(this).find('.item-price').data('price'));
            const itemTotal = quantity * price;
            
            $(this).find('.item-total').text('$' + itemTotal.toFixed(2));
            subtotal += itemTotal;
        });

        const tax = subtotal * 0.1; // 10% tax
        const deliveryFee = subtotal > 50 ? 0 : 5.99; // Free delivery over $50
        const total = subtotal + tax + deliveryFee;

        // Update totals display
        $('.cart-subtotal').text('$' + subtotal.toFixed(2));
        $('.cart-tax').text('$' + tax.toFixed(2));
        $('.cart-delivery').text('$' + deliveryFee.toFixed(2));
        $('.cart-total').text('$' + total.toFixed(2));

        // Update checkout button
        if (subtotal > 0) {
            $('.checkout-btn').prop('disabled', false);
        } else {
            $('.checkout-btn').prop('disabled', true);
        }
    }

    showNotification(message, type = 'info') {
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';

        const notification = $(`
            <div class="alert ${alertClass} alert-dismissible fade show notification-toast" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        // Add to notification container or body
        if ($('.notification-container').length) {
            $('.notification-container').append(notification);
        } else {
            $('body').append(`
                <div class="notification-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
                </div>
            `);
            $('.notification-container').append(notification);
        }

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 4000);
    }

    // Get cart data for checkout
    getCartData() {
        const cartData = {
            items: [],
            totals: {}
        };

        $('.cart-item').each(function() {
            const item = {
                id: $(this).data('item-id'),
                pizzaId: $(this).data('pizza-id'),
                name: $(this).find('.item-name').text(),
                size: $(this).find('.item-size').text(),
                quantity: parseInt($(this).find('.cart-quantity').val()),
                price: parseFloat($(this).find('.item-price').data('price')),
                toppings: $(this).find('.item-toppings').text().split(', ').filter(t => t)
            };
            cartData.items.push(item);
        });

        // Calculate totals
        const subtotal = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const deliveryFee = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + tax + deliveryFee;

        cartData.totals = {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            deliveryFee: deliveryFee.toFixed(2),
            total: total.toFixed(2)
        };

        return cartData;
    }
}

// Initialize cart manager
const cart = new CartManager();

// Export for global access
window.cart = cart;