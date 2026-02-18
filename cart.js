// cart.js
// Make sure supabase is already loaded (from the script tag in your HTML)

let cart = [];

// ------------------------------------------------------------
// Load cart from localStorage (guest) or Supabase (logged in)
// ------------------------------------------------------------
async function loadCart() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // Logged in – load from Supabase
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);
    if (!error) cart = data || [];
  } else {
    // Guest – load from localStorage
    const stored = localStorage.getItem('cart');
    cart = stored ? JSON.parse(stored) : [];
  }
  // If there's a renderCart function (on cart page), call it
  if (typeof renderCart === 'function') renderCart();
}

// ------------------------------------------------------------
// Save cart (localStorage for guest, Supabase for logged in)
// ------------------------------------------------------------
async function saveCart() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // Replace all cart items in Supabase with current cart
    // First delete existing items for this user
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    // Then insert current cart (if not empty)
    if (cart.length > 0) {
      const itemsWithUser = cart.map(item => ({ ...item, user_id: user.id }));
      await supabase.from('cart_items').insert(itemsWithUser);
    }
  } else {
    // Guest – save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  // Update any open cart display
  if (typeof renderCart === 'function') renderCart();
}

// ------------------------------------------------------------
// Add item to cart
// product: { id, name, price (in paise), quantity (default 1) }
// ------------------------------------------------------------
async function addToCart(product) {
  const existing = cart.find(item => item.product_id === product.id);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: product.quantity || 1
    });
  }
  await saveCart();
  alert('Added to cart!'); // optional feedback
}

// ------------------------------------------------------------
// Remove item completely
// ------------------------------------------------------------
async function removeFromCart(productId) {
  cart = cart.filter(item => item.product_id !== productId);
  await saveCart();
}

// ------------------------------------------------------------
// Update quantity (e.g., +1, -1)
// ------------------------------------------------------------
async function updateQuantity(productId, newQuantity) {
  const item = cart.find(i => i.product_id === productId);
  if (item) {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      await saveCart();
    }
  }
}

// ------------------------------------------------------------
// Clear entire cart
// ------------------------------------------------------------
async function clearCart() {
  cart = [];
  await saveCart();
}

// ------------------------------------------------------------
// Helper to get cart total (in paise)
// ------------------------------------------------------------
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ------------------------------------------------------------
// Auto‑load cart when this script loads
// ------------------------------------------------------------
loadCart();
