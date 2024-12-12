const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3000;

// Import the pizzas data from data.js
const { pizzas } = require('./data');

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Set the views directory and template engine
app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine', 'ejs');

// Specify the layout file
app.set('layout', 'main-layout');

// In-memory cart store
let cart = [];

// Route handler for the home page
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Shining Pizza',
        year: new Date().getFullYear(),
        pizzas: pizzas
    });
});

// Route handler for adding items to the cart
app.post('/add-to-cart', (req, res) => {
    const pizzaId = parseInt(req.body.pizzaId, 10);
    const pizza = pizzas.find(pizza => pizza.id === pizzaId);

    if (pizza) {
        cart.push(pizza);
        console.log(`Added pizza ${pizza.name} to cart`);
    } else {
        console.error(`Pizza with ID ${pizzaId} not found`);
    }

    res.redirect('/cart');
});

// Route handler for viewing the cart
app.get('/cart', (req, res) => {
    res.render('cart', {
        title: 'Your Cart',
        cart: cart
    });
});

// Route handler for removing items from the cart
app.post('/remove-from-cart', (req, res) => {
    const pizzaId = parseInt(req.body.pizzaId, 10);
    cart = cart.filter(pizza => pizza.id !== pizzaId);

    res.redirect('/cart');
});

// Route handler for login page
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Handling login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // For demo purposes, just log the data
    console.log(`Login attempt with Username: ${username} and Password: ${password}`);
    res.redirect('/');
});

// Route handler for registration page
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Handling registration form submission
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    // For demo purposes, just log the data
    console.log(`Registration attempt with Username: ${username}, Email: ${email}, and Password: ${password}`);
    res.redirect('/login');
});

// Basic error handling for invalid routes
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
