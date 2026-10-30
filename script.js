const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const categoryButtons = document.querySelectorAll(".category-button");
const noResults = document.getElementById("no-results");
const resultsCount = document.getElementById("results-count");

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const summaryItems = document.getElementById("summary-items");
const cartSubtotal = document.getElementById("cart-subtotal");

const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout-button");
const cartNotice = document.getElementById("cart-notice");

let products = [];
let selectedCategory = "All";
let cart = loadCart();

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem("shopnestCart")
        );

        if (Array.isArray(savedCart)) {
            return savedCart.filter(function (item) {
                return Number.isInteger(item.id) &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0;
            });
        }

        return [];
    } catch (error) {
        return [];
    }
}
async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        showProducts();
        showCart();

    } catch (error) {
        productGrid.innerHTML = "";

        const message = document.createElement("p");
        message.textContent =
            "Unable to load products. Please check your products.json file.";

        productGrid.appendChild(message);

        resultsCount.textContent = "Products could not be loaded.";
    }
}

function displayProducts(productList) {
    productGrid.innerHTML = "";

    productList.forEach(function (product) {

        const card = document.createElement("div");
        card.className = "card";

    
        const image = document.createElement("img");

        image.src = product.imageUrl;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = function () {
            image.onerror = null;
            image.src =
                "https://placehold.co/600x450/fce4ec/9b4567?text=ShopNest";
        };
        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;
        const name = document.createElement("h3");
        name.textContent = product.name;
        const rating = document.createElement("p");
        rating.className = "rating";
        rating.textContent = "★ " + product.rating + " / 5";
        const priceArea = document.createElement("div");
        priceArea.className = "price-area";
        const price = document.createElement("span");
        price.className = "price";
        price.textContent = "₹" + product.price;
        const originalPrice = document.createElement("del");
        originalPrice.textContent = "₹" + product.originalPrice;

        priceArea.append(price, originalPrice);
        const addButton = document.createElement("button");

        addButton.type = "button";
        addButton.className = "add-button";
        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", function () {
            addToCart(product.id);
        });

        card.append(
            image,
            category,
            name,
            rating,
            priceArea,
            addButton
        );

        productGrid.appendChild(card);
    });
}
function showProducts() {

    const searchText = searchInput.value.trim().toLowerCase();

    let filteredProducts = products.filter(function (product) {

        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
    if (sortSelect.value === "price-low") {

        filteredProducts.sort(function (a, b) {
            return a.price - b.price;
        });

    } else if (sortSelect.value === "price-high") {

        filteredProducts.sort(function (a, b) {
            return b.price - a.price;
        });

    } else if (sortSelect.value === "rating") {

        filteredProducts.sort(function (a, b) {
            return b.rating - a.rating;
        });
    }


    displayProducts(filteredProducts);

    resultsCount.textContent =
        filteredProducts.length + " product(s) found";

    noResults.hidden = filteredProducts.length !== 0;
}
function addToCart(productId) {

    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    showCart();

    cartNotice.textContent = "Product added to your cart.";
}
function changeQuantity(productId, change) {

    const item = cart.find(function (cartItem) {
        return cartItem.id === productId;
    });

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    showCart();
}
function removeFromCart(productId) {

    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    saveCart();
    showCart();

    cartNotice.textContent = "Product removed from your cart.";
}
function saveCart() {

    localStorage.setItem(
        "shopnestCart",
        JSON.stringify(cart)
    );
}
function showCart() {

    cartItems.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-cart";
        emptyMessage.textContent =
            "Your cart is empty. Add something you like!";

        cartItems.appendChild(emptyMessage);
    }


    cart.forEach(function (item) {

        const product = products.find(function (product) {
            return product.id === item.id;
        });

        if (!product) {
            return;
        }

        totalItems += item.quantity;

        totalPrice += product.price * item.quantity;

        const row = document.createElement("div");
        row.className = "cart-row";

        const details = document.createElement("div");
        details.className = "cart-product-details";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "₹" + product.price + " each";

        details.append(name, price);
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";
        const minusButton = document.createElement("button");

        minusButton.type = "button";
        minusButton.textContent = "−";

        minusButton.setAttribute(
            "aria-label",
            "Decrease " + product.name + " quantity"
        );

        minusButton.addEventListener("click", function () {
            changeQuantity(product.id, -1);
        });
        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;
        const plusButton = document.createElement("button");

        plusButton.type = "button";
        plusButton.textContent = "+";

        plusButton.setAttribute(
            "aria-label",
            "Increase " + product.name + " quantity"
        );

        plusButton.addEventListener("click", function () {
            changeQuantity(product.id, 1);
        });


        quantityControls.append(
            minusButton,
            quantity,
            plusButton
        );
        const itemTotal = document.createElement("strong");

        itemTotal.className = "cart-item-total";

        itemTotal.textContent =
            "₹" + (product.price * item.quantity).toFixed(2);

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            removeFromCart(product.id);
        });


        row.append(
            details,
            quantityControls,
            itemTotal,
            removeButton
        );

        cartItems.appendChild(row);
    });


    cartCount.textContent = totalItems;

    summaryItems.textContent = totalItems;

    cartSubtotal.textContent =
        "₹" + totalPrice.toFixed(2);

    checkoutButton.disabled = totalItems === 0;
}
categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        selectedCategory = button.dataset.category;

        categoryButtons.forEach(function (categoryButton) {

            const isActive = categoryButton === button;

            categoryButton.classList.toggle("active", isActive);

            categoryButton.setAttribute(
                "aria-pressed",
                isActive
            );
        });

        showProducts();
    });
});
searchInput.addEventListener("input", function () {
    showProducts();
});
sortSelect.addEventListener("change", function () {
    showProducts();
});
document.getElementById("clear-filters").addEventListener(
    "click",
    function () {

        searchInput.value = "";

        selectedCategory = "All";

        sortSelect.value = "featured";

        categoryButtons.forEach(function (button) {

            const isAll = button.dataset.category === "All";

            button.classList.toggle("active", isAll);

            button.setAttribute(
                "aria-pressed",
                isAll
            );
        });

        showProducts();
    }
);
clearCartButton.addEventListener("click", function () {

    cart = [];

    saveCart();
    showCart();

    cartNotice.textContent = "Your cart has been cleared.";
});
checkoutButton.addEventListener("click", function () {

    if (cart.length > 0) {

        cartNotice.textContent =
            "Thank you! Checkout is a demo feature for this assignment.";
    }
});
document.getElementById("current-year").textContent =
    new Date().getFullYear();
loadProducts();