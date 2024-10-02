import { order } from "../data/order.js";
import { products } from "../data/products.js";

let orderSummaryHTML = ""; // Initialize a variable to hold the HTML for the order summary

// Iterate over each item in the order to build the order summary
order.forEach((orderItem) => {
    const productID = orderItem.productID;
    let matchingProduct;

    // Find the matching product from the products list
    products.forEach((product) => {
        if (productID === product.id) {
            matchingProduct = product; // Set the matching product
        }
    });

    // Build HTML for the current order item
    orderSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="cart-item-details-grid">
              <img class="product-image" src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">${matchingProduct.name}</div>
                <div class="product-price">$${(matchingProduct.priceCents / 100).toFixed(2)}</div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${orderItem.quantity}</span>
                  </span>
                </div>
              </div>
            </div>
        </div>
    `;
});

// Insert the constructed HTML into the order summary section of the document
document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

// Check if there are any orders
if (order.length !== 0) {
    let orderStatus = document.querySelector('.order-status');
    orderStatus.innerHTML = "Order Status: Out for delivery"; 
    orderStatus.style.color = 'green';
} else {
    // If no orders have been placed, display a different message
    document.querySelector('.order-status').innerHTML = "You have not placed any orders yet";
}
