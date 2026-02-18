// cart.js
let cart = [];

// Load cart from localStorage or Supabase
async function loadCart() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // load from Supabase
    const { data } = await supabase.from('cart_items').select('*').eq('user_id', user.id);
    cart = data || [];
  } else {
    // load from localStorage
    const stored = localStorage.getItem('cart');
    cart = stored ? JSON.parse(stored) : [];
  }
  renderCart();
}

// Save cart (localStorage if guest, Supabase if logged in)
async function saveCart() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // replace all cart items in Supabase
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    if (cart.length) {
      const itemsWithUser = cart.map(item => ({ ...item, user_id: user.id }));
      await supabase.from('cart_items').insert(itemsWithUser);
    }
  } else {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// Add item to cart
async function addToCart(product) {
  const existing = cart.find(item => item.product_id === product.id);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push({
      product_id: product.id,
      product_name: product.name,
      price: product.price, // in paise
      quantity: product.quantity || 1
    });
  }
  await saveCart();
  renderCart();
}

// Remove/update functions...
