// cart.js
let cart = [];

async function loadCart() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);
    if (!error) cart = data || [];
  } else {
    const stored = localStorage.getItem('cart');
    cart = stored ? JSON.parse(stored) : [];
  }
  if (typeof renderCart === 'function') renderCart();
}

async function saveCart() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    if (cart.length > 0) {
      const itemsWithUser = cart.map(item => ({ ...item, user_id: user.id }));
      await supabase.from('cart_items').insert(itemsWithUser);
    }
  } else {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  if (typeof renderCart === 'function') renderCart();
}

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
  alert('Added to cart!');
}

async function removeFromCart(productId) {
  cart = cart.filter(item => item.product_id !== productId);
  await saveCart();
}

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

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

loadCart();
