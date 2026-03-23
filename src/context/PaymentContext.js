import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentCards, setPaymentCards] = useState([
    {
      id: 1,
      cardNumber: "**** **** **** 4532",
      cardHolder: "JOHN DOE",
      expiryDate: "12/26",
      brand: "visa",
      isDefault: true,
    },
    {
      id: 2,
      cardNumber: "**** **** **** 8765",
      cardHolder: "JOHN DOE",
      expiryDate: "08/27",
      brand: "mastercard",
      isDefault: false, // Changed to false to maintain single-default integrity
    },
  ]);

  // ✅ Helper to find the current default
  const getDefaultCard = () => paymentCards.find(card => card.isDefault) || paymentCards[0];

  // ✅ Set a specific card as default and unset others
  const setDefaultCard = (id) => {
    setPaymentCards(prev =>
      prev.map(card => ({
        ...card,
        isDefault: card.id === id,
      }))
    );
  };

  // ✅ Add card and optionally make it the new default
  const addCard = (newCard) => {
    setPaymentCards(prev => {
      // If the new card is being set as default, unset others
      const updated = newCard.isDefault 
        ? prev.map(c => ({ ...c, isDefault: false })) 
        : prev;

      return [...updated, { ...newCard, id: Date.now() }];
    });
  };

  const deleteCard = (id) => {
    setPaymentCards(prev => prev.filter(card => card.id !== id));
  };

  return (
    <PaymentContext.Provider value={{ paymentCards, getDefaultCard, addCard, setDefaultCard, deleteCard }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);