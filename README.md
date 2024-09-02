# Pizza Shop Node Application

## Description

The **Pizza Shop Web Application** is a simple e-commerce platform that allows users to browse various pizza options, add them to their cart, proceed to checkout, and receive an order confirmation. 

This project was built as my **first Node.js application**, created **for practice purposes** to learn and improve my skills in backend development using **Node.js**. The application uses **EJS** for templating and is powered by **Node.js** with **Express** as the backend framework.

### Key Features:
- **Browse Pizzas**: Users can view various pizzas with details such as name, price, and ingredients.
- **Add Items to Cart**: Users can add pizzas to their cart with a click.
- **Checkout and Purchase**: Once ready, users can fill in their shipping details and make a purchase.
- **Order Confirmation**: After placing an order, users receive a confirmation page with details of the order.
- **Responsive UI**: The app is designed to work smoothly on all devices, providing a seamless user experience.



## Installation

### Prerequisites
- **Node.js** (>= 12.x)
- **npm** (Node Package Manager)

### Steps to Install

1. **Clone the repository** to your local machine:

    git clone https://github.com/shivas1432/pizza_node.js.git
   

2. **Install npm Dependencies**:

    In the root directory of your project, run:

    npm install
    

3. **Set Up Environment Variables**:

   "I didn't use environment variables"

4. **Run the Development Server**:

    To start the development server and automatically compile assets with hot-reloading:

    npm run dev
   
    This will:
    - Compile and bundle your assets (CSS, JS).
    - Watch for changes in your files and rebuild the assets when you make changes.
    - Start the server locally (usually accessible at `http://localhost:3000`).

### Running in Production

For production, you should build and optimize your assets:

npm run production
This command will:

Minify and version the assets (JavaScript and CSS).
Place optimized files in the /public directory.
Enhance performance by reducing load times.
Project Structure
Here’s an overview of the important directories and files:


/resources/views      - EJS view templates
/public               - Public files (images, fonts, compiled assets like CSS/JS)
/resources            - Make changes in server side
/src                  - Application routes
/package.json         - Node.js project dependencies
/webpack.mix.js       - Laravel Mix configuration for compiling assets
Asset Management with Laravel Mix
Laravel Mix is used to compile and bundle your assets. You can modify or add new assets by editing the relevant resources files.

JavaScript Files: /resources/js/app.js, /resources/js/cart.js, /resources/js/product.js, etc.
CSS Files: /resources/css/products.css, /resources/css/payment.css, /resources/css/header.css, etc.
The webpack.mix.js file contains the configuration for compiling and bundling assets.

Example of Usage in EJS Views
In your EJS templates, you can link the compiled assets using the mix() helper:

<head>
    <link rel="stylesheet" href="{{ mix('/css/app.css') }}">
</head>

<body>
    <script src="{{ mix('/js/app.js') }}"></script>
</body>
This ensures that the latest version of the compiled assets is included in the view.

Useful Commands
Start Development Server:

npm run dev
Compile Assets for Production:

npm run production
Start the Application:

The application can be started on a specific port (by default, at http://localhost:3000):

npm start