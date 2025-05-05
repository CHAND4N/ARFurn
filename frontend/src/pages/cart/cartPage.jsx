import React, { useEffect, useContext } from "react";
import { CartContext } from "../../context/CartContext";

const CartPage = () => {
  const { cartItems, fetchCartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Actions</th>
              <th className="border p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">Rs. {item.price}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      -
                    </button>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      )}
      
      
    </div>
  );
};

export default CartPage;
