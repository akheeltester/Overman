// auth.js
import { supabase } from './supabaseClient.js';

document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = signupForm.email.value;
      const password = signupForm.password.value;

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Signup successful. Check email for verification.");
        window.location.href = "login.html";
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert(error.message);
      } else {
        window.location.href = "index.html";
      }
    });
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      window.location.href = "login.html";
    }
  });
});
