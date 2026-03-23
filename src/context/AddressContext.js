import React, { createContext, useContext, useState } from "react";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "home",
      label: "Home",
      street: "123 Main St",
      city: "Colombo",
      state: "",
      zipCode: "",
      phone: "+94 77 123 4567",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      label: "Office",
      street: "456 Business Ave",
      city: "Colombo",
      state: "",
      zipCode: "",
      phone: "+94 77 987 6543",
      isDefault: false,
    },
  ]);

  const setDefaultAddress = (id) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefault);
  };

  return (
    <AddressContext.Provider value={{
      addresses,
      setAddresses,
      setDefaultAddress,
      getDefaultAddress
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);