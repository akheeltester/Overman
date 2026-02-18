// auth-config.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with your project's URL and anonymous key
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sign up a new user
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */
export const signUp = async (email, password) => {
    return await supabase.auth.signUp({ email, password });
};

/**
 * Sign in an existing user
 * @param {string} email 
 * @param {string} password 
 * @returns 
 */
export const signIn = async (email, password) => {
    return await supabase.auth.signIn({ email, password });
};

/**
 * Sign out the current user
 * @returns 
 */
export const signOut = async () => {
    return await supabase.auth.signOut();
};

/**
 * Get the current user
 * @returns 
 */
export const getCurrentUser = () => {
    return supabase.auth.user();
};

/**
 * Get the session
 * @returns 
 */
export const getSession = () => {
    return supabase.auth.session();
};

// Export the Supabase client as well
export { supabase };