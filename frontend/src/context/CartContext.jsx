import React, { createContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      await axios.post('http://localhost:5000/cart', {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1, // Always add 1
      });
      fetchCartItems();
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${product.name} added successfully.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      await axios.post('http://localhost:5000/cart', {
        id: productId,
        quantity: 1, // Increase by 1
      });
      fetchCartItems();
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      await axios.post('http://localhost:5000/cart', {
        id: productId,
        quantity: -1, // Decrease by 1
      });
      fetchCartItems();
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${productId}`);
      fetchCartItems();
      Swal.fire({
        icon: 'success',
        title: 'Removed!',
        text: 'Product removed from your cart.',
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        cartCount,
        fetchCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
