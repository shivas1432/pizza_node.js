// Main JavaScript for Pizza Palace

$(document).ready(function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-hide alerts
    $('.alert').delay(5000).fadeOut('slow');

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Add animation classes to elements on scroll
    $(window).scroll(function() {
        $('.card').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('fade-in');
            }
        });
    });

    // Loading states for buttons
    $(document).on('click', '.btn[type="submit"]', function() {
        var $btn = $(this);
        var originalText = $btn.html();
        $btn.html('<span class="spinner"></span> Loading...').prop('disabled', true);
        
        // Re-enable button after 5 seconds (fallback)
        setTimeout(function() {
            $btn.html(originalText).prop('disabled', false);
        }, 5000);
    });
});

// Cart Management Functions
class CartManager {
    constructor() {
        this.cartCount = parseInt($('#cart-count').text()) || 0;
    }

    updateCartCounter(count) {
        this.cartCount = count;
        $('#cart-count').text(count).addClass('cart-counter');
        setTimeout(() => {
            $('#cart-count').removeClass('cart-counter');
        }, 500);
    }

    addToCart(pizzaId, size, quantity, toppings) {
        return fetch('/order/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pizzaId,
                size,
                quantity,
                toppings
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.updateCartCounter(data.cartCount);
                this.showNotification('Item added to cart!', 'success');
                return true;
            } else {
                this.showNotification(data.error || 'Failed to add item to cart', 'error');
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.showNotification('Failed to add item to cart', 'error');
            return false;
        });
    }

    removeFromCart(itemId) {
        return fetch(`/order/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.updateCartCounter(data.cartCount);
                this.showNotification('Item removed from cart!', 'success');
                return true;
            } else {
                this.showNotification(data.error || 'Failed to remove item', 'error');
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.showNotification('Failed to remove item', 'error');
            return false;
        });
    }

    clearCart() {
        return fetch('/order/cart/clear', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.updateCartCounter(0);
                this.showNotification('Cart cleared!', 'success');
                return true;
            } else {
                this.showNotification(data.error || 'Failed to clear cart', 'error');
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.showNotification('Failed to clear cart', 'error');
            return false;
        });
    }

    showNotification(message, type = 'info') {
        const alertClass = type === 'success' ? 'alert-success' : 
                          type === 'error' ? 'alert-danger' : 
                          type === 'warning' ? 'alert-warning' : 'alert-info';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show position-fixed" style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $('body').append(alertHtml);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            $('.alert').last().fadeOut('slow', function() {
                $(this).remove();
            });
        }, 3000);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Form Validation Functions
class FormValidator {
    constructor() {
        this.rules = {
            required: (value) => value && value.trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^[\+]?[(]?[\+]?[0-9\s\-\(\)]{10,}$/.test(value),
            minLength: (value, length) => value && value.length >= length,
            maxLength: (value, length) => !value || value.length <= length,
            numeric: (value) => /^\d+$/.test(value),
            password: (value) => value && value.length >= 6,
            confirmPassword: (value, originalValue) => value === originalValue
        };
    }

    validateField(field, rules) {
        const $field = $(field);
        const value = $field.val();
        const errors = [];

        rules.forEach(rule => {
            if (typeof rule === 'string') {
                if (!this.rules[rule](value)) {
                    errors.push(this.getErrorMessage(rule, $field.attr('name')));
                }
            } else if (typeof rule === 'object') {
                const ruleName = Object.keys(rule)[0];
                const ruleValue = rule[ruleName];
                if (!this.rules[ruleName](value, ruleValue)) {
                    errors.push(this.getErrorMessage(ruleName, $field.attr('name'), ruleValue));
                }
            }
        });

        this.showFieldValidation($field, errors);
        return errors.length === 0;
    }

    validateForm(formSelector, validationRules) {
        const $form = $(formSelector);
        let isValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            const $field = $form.find(`[name="${fieldName}"]`);
            if ($field.length) {
                const fieldValid = this.validateField($field[0], validationRules[fieldName]);
                if (!fieldValid) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    showFieldValidation($field, errors) {
        $field.removeClass('is-invalid is-valid');
        $field.siblings('.invalid-feedback').remove();

        if (errors.length > 0) {
            $field.addClass('is-invalid');
            $field.after(`<div class="invalid-feedback">${errors[0]}</div>`);
        } else if ($field.val()) {
            $field.addClass('is-valid');
        }
    }

    getErrorMessage(rule, fieldName, ruleValue) {
        const messages = {
            required: `${this.formatFieldName(fieldName)} is required`,
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            minLength: `${this.formatFieldName(fieldName)} must be at least ${ruleValue} characters`,
            maxLength: `${this.formatFieldName(fieldName)} must not exceed ${ruleValue} characters`,
            numeric: `${this.formatFieldName(fieldName)} must contain only numbers`,
            password: 'Password must be at least 6 characters long',
            confirmPassword: 'Passwords do not match'
        };

        return messages[rule] || `${this.formatFieldName(fieldName)} is invalid`;
    }

    formatFieldName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
    }
}

// Initialize form validator
const formValidator = new FormValidator();

// Search and Filter Functions
class SearchFilter {
    constructor() {
        this.debounceTimer = null;
    }

    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }

    searchPizzas(query) {
        this.debounce(() => {
            const url = new URL(window.location);
            if (query.trim()) {
                url.searchParams.set('search', query);
            } else {
                url.searchParams.delete('search');
            }
            window.location = url.toString();
        }, 500);
    }

    filterByCategory(categoryId) {
        const url = new URL(window.location);
        if (categoryId && categoryId !== 'all') {
            url.searchParams.set('category', categoryId);
        } else {
            url.searchParams.delete('category');
        }
        window.location = url.toString();
    }

    sortBy(sortOption) {
        const url = new URL(window.location);
        if (sortOption) {
            url.searchParams.set('sort', sortOption);
        } else {
            url.searchParams.delete('sort');
        }
        window.location = url.toString();
    }
}

// Initialize search filter
const searchFilter = new SearchFilter();

// Order Status Functions
class OrderManager {
    updateStatus(orderId, status) {
        return fetch(`/order/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                cartManager.showNotification('Order status updated successfully!', 'success');
                return true;
            } else {
                cartManager.showNotification(data.error || 'Failed to update order status', 'error');
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            cartManager.showNotification('Failed to update order status', 'error');
            return false;
        });
    }

    trackOrder(orderId) {
        return fetch(`/api/orders/${orderId}/status`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    return data.data;
                } else {
                    throw new Error(data.error || 'Failed to track order');
                }
            });
    }
}

// Initialize order manager
const orderManager = new OrderManager();

// Image Upload and Preview Functions
function previewImage(input, previewSelector) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            $(previewSelector).attr('src', e.target.result).show();
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Price Calculation Functions
function calculatePizzaPrice(pizza, selectedSize, selectedToppings, quantity) {
    if (!pizza || !selectedSize) return 0;
    
    // Find size price
    const sizeObj = pizza.sizes.find(s => s.size === selectedSize);
    let basePrice = sizeObj ? sizeObj.price : 0;
    
    // Add toppings price
    let toppingsPrice = 0;
    if (selectedToppings && Array.isArray(selectedToppings)) {
        selectedToppings.forEach(toppingName => {
            const topping = pizza.toppings.find(t => t.name === toppingName);
            if (topping) {
                toppingsPrice += topping.price;
            }
        });
    }
    
    return (basePrice + toppingsPrice) * (quantity || 1);
}

function calculateOrderTotal(items, taxRate = 0.1, deliveryFee = 5.99) {
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax + deliveryFee;
    
    return {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: total.toFixed(2)
    };
}

// Local Storage Functions (for temporary data)
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(`pizza_palace_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn('LocalStorage not available:', error);
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(`pizza_palace_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('LocalStorage not available:', error);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(`pizza_palace_${key}`);
        } catch (error) {
            console.warn('LocalStorage not available:', error);
        }
    },
    
    clear() {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('pizza_palace_'));
            keys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.warn('LocalStorage not available:', error);
        }
    }
};

// Export functions for global use
window.cartManager = cartManager;
window.formValidator = formValidator;
window.searchFilter = searchFilter;
window.orderManager = orderManager;
window.previewImage = previewImage;
window.calculatePizzaPrice = calculatePizzaPrice;
window.calculateOrderTotal = calculateOrderTotal;
window.storage = storage;