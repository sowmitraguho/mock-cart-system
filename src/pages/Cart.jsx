import { useEffect, useState } from "react";
import api from "../api/api";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const res = await api.get("/cart");
    setCart(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id, newQty) => {
    if (newQty <= 0) return;
    await api.put(`/cart/${id}`, { quantity: newQty });
    fetchCart();
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    fetchCart();
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded"
                />
                <div>
                  <h2 className="font-semibold">{item.product.name}</h2>
                  <p>${item.product.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="bg-gray-300 px-2 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="bg-gray-300 px-2 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-lg">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
