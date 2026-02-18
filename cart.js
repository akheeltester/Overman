// Enhanced Cart Management Functions

let cart = [];

// Add an item to the cart
function addToCart(item) {
    cart.push(item);
}

// Remove an item from the cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
}

// Update the quantity of an item in the cart
function updateCartQuantity(itemId, quantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = quantity;
    }
}

// Get the current cart
function getCart() {
    return cart;
}

// Get the count of items in the cart
function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Get the total price of the cart
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Clear the cart
function clearCart() {
    cart = [];
}

// Update the cart count (for UI or notifications)
function updateCartCount() {
    const count = getCartCount();
    // Update UI elements or trigger notifications here.
}

// Export functions for external usage
export { addToCart, removeFromCart, updateCartQuantity, getCart, getCartCount, getCartTotal, clearCart, updateCartCount };