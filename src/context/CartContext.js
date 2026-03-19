import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Total item count (badge)
  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cartItems]);

  // ✅ Total price
  const getCartTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // ✅ Add to cart (id + unit safe)
  const addToCart = (product) => {
    if (!product) return;

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.unit === product.unit
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.unit === product.unit
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }

      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // ✅ Remove item (id + unit FIXED)
  const removeFromCart = (id, unit) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.unit === unit))
    );
  };

  // ✅ Update quantity FIXED (id + unit)
  const updateQuantity = (id, unit, change) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.unit === unit) {
            const newQty = item.quantity + change;
            if (newQty <= 0) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};