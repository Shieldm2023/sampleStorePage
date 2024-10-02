import { cart, saveToStorage } from "../data/cart.js";
import { products } from "../data/products.js";

// Select the mobile menu element
const mobileMenu = document.querySelector(".mobile-menu");

// Event listener to toggle mobile dropdown menu visibility
mobileMenu.addEventListener('click', function() {
    const dropDown = document.querySelector(".mobile-drop-down");
    const header = document.querySelector(".header");
    
    // Check the current display style of the dropdown
    if (dropDown.style.display != "flex") {
        dropDown.style.display = "flex"; // Show dropdown
        header.style.padding = "0px 200px 0px 10px"; // Adjust header padding
    } else {
        dropDown.style.display = "none"; // Hide dropdown
        header.style.padding = "0px 10px 0px 10px"; // Reset header padding
    }
});

// Function to set up the products page with provided products
function setProductsPage(products) {
    let productsHTML = ""; // Initialize a variable to hold the HTML for the products

    // Iterate through each product to build the HTML
    products.forEach((product) => {
        productsHTML += `
            <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image" src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-rating-container">
                    <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
                    <div class="product-rating-count link-primary">
                        ${product.rating.count}
                    </div>
                </div>

                <div class="product-price">
                    ${(product.priceCents / 100).toFixed(2)}
                </div>

                <div class="product-quantity-container">
                    <select class="quantity-select">
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>

                <div class="product-spacer"></div>

                <div class="added-to-cart">
                    <img src="images/icons/checkmark.png">
                    Added
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart" data-product="${product.id}">
                    Add to Cart
                </button>
            </div>`;
    });

    // Insert the constructed HTML into the products grid in the document
    document.querySelector('.js-products-grid').innerHTML = productsHTML;

    // Attach event listeners for "Add to Cart" buttons
    attachAddToCartListeners();
}

// Function to attach event listeners to "Add to Cart" buttons
function attachAddToCartListeners() {
    // Select all "Add to Cart" buttons and attach click event listeners
    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
        button.addEventListener('click', () => {
            const productID = button.dataset.product;
            let matchingItem; 
            const quantitySelect = button.closest('.product-container').querySelector('.quantity-select'); 
            const quantity = parseInt(quantitySelect.value, 10); 
            
            // Check if the product already exists in the cart
            cart.forEach((item) => {
                if (productID === item.productID) {
                    matchingItem = item; // Found a matching item
                }
            });

            // Update the cart with the selected quantity
            if (matchingItem) {
                matchingItem.quantity += quantity; // Update quantity if the item exists
            } else {
                // Add new item to the cart if it doesn't exist
                cart.push({
                    productID: productID,
                    quantity: quantity
                });
            }

            // Calculate the total quantity in the cart
            let cartQuantity = 0;
            cart.forEach((item) => {
                cartQuantity += item.quantity; 
            });

            // Update the cart quantity display
            document.querySelector('.cart-quantity').innerHTML = cartQuantity;

            // Save the updated cart to storage
            saveToStorage();

            // Show "Added" notification briefly
            const addedToCart = button.closest('.product-container').querySelector('.added-to-cart');
            addedToCart.style.opacity = '10'; // Make it visible
            setTimeout(() => {
                addedToCart.style.opacity = '0'; // Fade out
                addedToCart.style.transition = 'opacity 0.2s linear'; // Set transition for opacity change
            }, 800);
            addedToCart.style.transition = ''; // Reset transition
        });
    });
}

// Initialize the products page with the product data
setProductsPage(products);

// Function to handle product search based on keywords
function searchPage(keyStrings) {
    const matchingProducts = []; 
    products.forEach((product) => {
        keyStrings.forEach((keyString) => {
            // Check if the product has keywords that match any of the search strings
            if (product.keywords.some(keyword => keyword.includes(keyString))) {
                matchingProducts.push(product);
            }
        });
    });

    // If matching products found, update the products page
    if (matchingProducts.length !== 0) {
        setProductsPage(matchingProducts);
    } else {
        alert('No Items Found'); // Alert user if no products found
    }
}

// Event listener for the search button
document.querySelector('.search-button').addEventListener('click', () => {
    let searchedText = [];
    searchedText.push(document.querySelector('.search-bar').value.toLowerCase());
    searchPage(searchedText); // Call the search function with the input
});

// Event listeners for various category filters
document.querySelector('.js-styles').addEventListener('click', () => {
    let searchedText = [];
    searchedText.push("apparel"); // Filter for apparel
    searchPage(searchedText);
});

document.querySelector('.js-tech').addEventListener('click', () => {
    let searchedText = [];
    searchedText.push("electronics"); // Filter for electronics
    searchPage(searchedText);
});

document.querySelector('.js-bedding').addEventListener('click', () => {
    let searchedText = [];
    searchedText.push("bedroom"); // Filter for bedroom items
    searchPage(searchedText);
});

document.querySelector('.js-top').addEventListener('click', () => {
    let searchedText = [];
    searchedText.push("winter", "hood"); // Filter for winter and hood items
    searchPage(searchedText);
});

// Event listener for trending items
document.querySelector('.js-trend').addEventListener('click', () => {
    products.forEach((product) => {
        if (product.rating.count > 200) {
            product.keywords.push("trending"); // Mark as trending if rating count is high
        }
    });

    let searchedText = [];
    searchedText.push("trending"); // Filter for trending items
    searchPage(searchedText);
});

// Event listener for favorite items
document.querySelector('.js-favorites').addEventListener('click', () => {
    products.forEach((product) => {
        if (product.rating.stars > 4) {
            product.keywords.push("favorite"); // Mark as favorite if rating is above 4 stars
        }
    });

    let searchedText = [];
    searchedText.push("favorite"); // Filter for favorite items
    searchPage(searchedText);
});

// On DOM content loaded, update the cart quantity display
document.addEventListener('DOMContentLoaded', () => {
    let cartQuantity = 0;
    cart.forEach((item) => {
        cartQuantity += item.quantity; // Sum up quantities in the cart
    });
    document.querySelector('.cart-quantity').innerHTML = cartQuantity; // Update the cart display
});

    




