# ShopNest Interactive App

A single-page shopping app created for the JavaScript Module End Assignment.

## Files
- `index.html` - page structure
- `style.css` - layout and responsive styling
- `script.js` - Fetch API, rendering, search, category filters, sorting and cart
- `products.json` - product data (12 products)

## Run the project
1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The page loads product data from `products.json` using Fetch API. Do not open the HTML file directly with `file://`.

## Features
- 12 product objects with id, name, category, price, originalPrice, rating and imageUrl
- Product cards created with JavaScript DOM methods
- Live name search and category filters that work together
- Price and rating sorting
- Add to cart, increase/decrease quantity, and remove item
- Cart saved in localStorage and restored after refresh
- Live cart count, subtotal and no-results message

Checkout is a demonstration only; no real payment is processed.
