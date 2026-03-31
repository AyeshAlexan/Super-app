import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthHeaders = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    
    // Log for debugging (Remove in production)
    console.log("--- DEBUGGING AUTH ---");
    console.log("Token found in Storage:", token ? "YES (Starts with " + token.substring(0,10) + "...)" : "NO (NULL)");
    
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  } catch (error) {
    console.error("AsyncStorage Error:", error);
    return { headers: {} };
  }
};

export const fetchCart = async () => {
  try {
    const authHeader = await getAuthHeaders();
    if (!authHeader.headers.Authorization) return { items: [] }; 
    // This hits Route::get('/cart', ...) in Laravel
    const response = await API.get("/cart", authHeader);
    return response.data;
  } catch (error) {
    console.error("Fetch Cart Error:", error.message);
    return { items: [] };
  }
};

export const addToCartApi = async (payload) => {
  try {
    const authHeader = await getAuthHeaders();
    // We send the payload directly as it was already formatted in Context
    const response = await API.post("/cart/add", payload, authHeader);
    return response.data;
  } catch (error) {
    console.error("Add API Error Status:", error.response?.status);
    console.error("Add API Error Data:", error.response?.data); // Important for 422 details
    throw error;
  }
};
 export const removeFromCartApi = async (product_id, unit) => {
  try {
    const authHeader = await getAuthHeaders();

    const response = await API.post(
      "/cart/remove",
      {
        product_id,
        unit,
      },
      authHeader
    );

    return response.data;
  } catch (error) {
    console.error("Remove API Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ FIXED: Changed to accept a single object to match CartContext.js
export const updateCartApi = async (data) => {
  try {
    const { id, unit, change } = data; // Destructure the object
    const authHeader = await getAuthHeaders();
    
    const response = await API.post("/cart/update", { 
      id, 
      unit, 
      change 
    }, authHeader);
    
    return response.data;
  } catch (error) {
    console.error("Update API Error:", error.response?.data || error.message);
    throw error;
  }

};