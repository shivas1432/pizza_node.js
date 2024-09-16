// Import Bootstrap
import 'bootstrap';

// Import custom modules
import './modules/cart';
import './modules/search';
import './modules/validation';
import './modules/notifications';

// jQuery ready function
$(document).ready(function() {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Initialize popovers
    $('[data-bs-toggle="popover"]').popover();
    
    // Auto-hide alerts after 5 seconds
    $('.alert').delay(5000).fadeOut('slow');
    
    // Smooth scrolling
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });
    
    // Loading states for forms
    $('form').on('submit', function() {
        $(this).find('button[type="submit"]').prop('disabled', true).html(
            '<span class="spinner-border spinner-border-sm me-2"></span>Processing...'
        );
    });
    
    // Image lazy loading
    $('img[data-src]').each(function() {
        const img = $(this);
        img.attr('src', img.data('src')).removeAttr('data-src');
    });
    
    // Initialize animations on scroll
    initScrollAnimations();
    
    // Initialize price calculator
    initPriceCalculator();
});

// Scroll animations
function initScrollAnimations() {
    $(window).scroll(function() {
        $('.animate-on-scroll').each(function() {
            const element = $(this);
            const elementTop = element.offset().top;
            const elementBottom = elementTop + element.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                element.addClass('animated fadeInUp');
            }
        });
    });
}

// Price calculator for pizza customization
function initPriceCalculator() {
    $(document).on('change', '.pizza-options input', function() {
        calculatePizzaPrice();
    });
}

function calculatePizzaPrice() {
    const pizzaData = window.currentPizza;
    if (!pizzaData) return;
    
    const form = $('#pizzaCustomizationForm');
    const selectedSize = form.find('input[name="size"]:checked').val();
    const selectedToppings = form.find('input[name="toppings"]:checked').map(function() {
        return $(this).val();
    }).get();
    const quantity = parseInt(form.find('input[name="quantity"]').val()) || 1;
    
    let totalPrice = 0;
    
    // Base price for selected size
    if (selectedSize && pizzaData.sizes) {
        const sizeData = pizzaData.sizes.find(s => s.size === selectedSize);
        if (sizeData) {
            totalPrice += sizeData.price;
        }
    }
    
    // Add toppings price
    if (selectedToppings.length > 0 && pizzaData.toppings) {
        selectedToppings.forEach(toppingName => {
            const toppingData = pizzaData.toppings.find(t => t.name === toppingName);
            if (toppingData) {
                totalPrice += toppingData.price;
            }
        });
    }
    
    // Multiply by quantity
    totalPrice *= quantity;
    
    // Update display
    $('#totalPrice').text(totalPrice.toFixed(2));
    $('#addToCartBtn').data('price', totalPrice);
}

// Global functions
window.calculatePizzaPrice = calculatePizzaPrice;