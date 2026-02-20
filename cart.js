import { supabase } from './supabaseClient.js';

let cart = [];

async function loadCart() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    cart = data || [];
  } else {
    const stored = localStorage.getItem("cart");
    cart = stored ? JSON.parse(stored) : [];
  }

  renderCart();
}

async function saveCart() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    if (cart.length > 0) {
      const items = cart.map(item => ({
        ...item,
        user_id: user.id
      }));

      await supabase.from("cart_items").insert(items);
    }
  } else {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

function addToCart(product) {
  const existing = cart.find(i => i.product_id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

loadCart();
