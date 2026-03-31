import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { fetchCart, addToCartApi, updateCartApi, removeFromCartApi } from "../services/cartService";  
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync cart when the component mounts
  useEffect(() => {
    syncCart();
  }, []);

  const syncCart = async () => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) return;

  try {
    setLoading(true);
    const res = await fetchCart();

    const items = res.items || res.data?.items || [];

    // ✅ MERGE DUPLICATES (IMPORTANT FIX)
    const merged = {};

    items.forEach(item => {
      const key = `${item.product_id || item.id}-${item.unit}`;

      if (merged[key]) {
        merged[key].quantity += parseFloat(item.quantity);
      } else {
        merged[key] = {
          ...item,
          id: item.product_id || item.id,
          image: item.image_url || item.image,
          price: parseFloat(item.price),
          quantity: parseFloat(item.quantity)
        };
      }
    });

    setCartItems(Object.values(merged));

  } catch (err) {
    console.log("Sync Error:", err.message);
  } finally {
    setLoading(false);
  }
};
  const cartCount = useMemo(() =>
    cartItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0),
  [cartItems]);

  const addToCart = async (product) => {
    // ✅ Optimistic UI
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.unit === product.unit);
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.unit === product.unit
            ? { ...i, quantity: parseFloat(i.quantity) + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    try {
      const payload = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unit: product.unit || "kg",
        image: product.image
      };

      await addToCartApi(payload);
    } catch (e) {
      console.error("Add to Cart Failed:", e.response?.data || e.message);
      syncCart();
    }
  };

  const updateQuantity = async (id, unit, change) => {
    // ✅ Optimistic UI
    setCartItems(prev =>
      prev.map(i =>
        (i.id === id && i.unit === unit)
          ? { ...i, quantity: parseFloat(i.quantity) + change }
          : i
      ).filter(i => i.quantity > 0)
    );

    try {
      await updateCartApi({
        id,
        unit,
        change
      });
    } catch (e) {
      console.error("Update Quantity Failed:", e.response?.data || e.message);
      syncCart();
    }
  };

  // ✅ FIXED REMOVE (REAL DELETE FROM DB)
  const removeFromCart = async (id, unit) => {
    // 1. Optimistic UI
    setCartItems(prev =>
      prev.filter(i => !(i.id === id && i.unit === unit))
    );

    try {
      // 2. DELETE from backend
      await removeFromCartApi(id, unit);

      // 🔄 Optional (recommended for accuracy)
      // await syncCart();

    } catch (e) {
      console.error("Remove Failed:", e.response?.data || e.message);
      syncCart(); // rollback if error
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      syncCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);