import { cart, removeFromCart } from "../data/cart.js"; 
import { order, saveOrderToStorage } from "../data/order.js";
import { products } from "../data/products.js";

// Initialize variables to hold cart summary details
let cartSummaryHTML = '';
let cartQuantity = 0;
let priceSum = 0;
let priceSumShipping = 0; 
let shipping = 0;
let priceSumTax = 0; 
let tax = 0; 

// Iterate over each item in the cart to build the cart summary
cart.forEach((cartItem) => {
    const productID = cartItem.productID; 
    let matchingProduct; 
    cartQuantity += cartItem.quantity;

    // Find the matching product from the products list
    products.forEach((product) => {
        if (productID === product.id) {
            matchingProduct = product; // Set matching product
        }
    });

    // Calculate the total price of items in the cart
    priceSum += matchingProduct.priceCents * cartItem.quantity;

    // Calculate shipping, tax, and total price only if there are items in the cart
    if (cartQuantity !== 0) {
        shipping = 499; // Fixed shipping cost (in cents)
        priceSumShipping = priceSum + shipping; 
        tax = priceSumShipping * 0.10; 
        priceSumTax = priceSumShipping * 1.10; 
    }

    // Build HTML for the current cart item
    cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="cart-item-details-grid">
              <img class="product-image" src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">${matchingProduct.name}</div>
                <div class="product-price">$${(matchingProduct.priceCents / 100).toFixed(2)}</div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>
            </div>
        </div>
    `;
});

// Append the payment summary to the cart summary HTML
cartSummaryHTML += `
<div class="payment-summary" id="payment-summary-div">
<div class="payment-summary-title">Order Summary</div>

<div class="payment-summary-row">
  <div class="payment-summary-item-count">Items (${cartQuantity}):</div>
  <div class="payment-summary-money">$${(priceSum / 100).toFixed(2)}</div>
</div>

<div class="payment-summary-row">
  <div>Shipping &amp; handling:</div>
  <div class="payment-summary-money">$${(shipping / 100).toFixed(2)}</div>
</div>

<div class="payment-summary-row subtotal-row">
  <div>Total before tax:</div>
  <div class="payment-summary-money">$${(priceSumShipping / 100).toFixed(2)}</div>
</div>

<div class="payment-summary-row">
  <div>Estimated tax (10%):</div>
  <div class="payment-summary-money">$${(tax / 100).toFixed(2)}</div>
</div>

<div class="payment-summary-row total-row">
  <div>Order total:</div>
  <div class="payment-summary-money">$${(priceSumTax / 100).toFixed(2)}</div>
</div>

<button class="place-order-button button-primary js-order-button">Place your order</button>
</div>`;

// Display the cart summary and item quantity in the HTML
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
document.querySelector('.item-quantity').innerHTML = cartQuantity;

// Set up delete functionality for each item in the cart
document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productID = link.dataset.productId; 
        removeFromCart(productID); // Remove the item from the cart
        location.reload(); // Refresh the page to update the cart display
        const productContainer = document.querySelector(`.js-cart-item-container-${productID}`);
        productContainer.remove(); 
    });
});

// Set up functionality for placing the order
document.querySelector('.js-order-button').addEventListener('click', () => {
    if (cart.length !== 0) { // Check if the cart is not empty
        saveOrderToStorage(cart); // Save the current cart as an order
        cart.forEach((cartItem) => {
            removeFromCart(cartItem.productID); // Remove each item from the cart
        });
        location.reload(); // Refresh the page to update the cart display
    } else {
        alert("Your Cart is Empty!"); 
    }
});
