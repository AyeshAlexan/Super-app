import api from "./api";

export const getHomeProducts = async () => {
  try {
    const response = await api.get("/getHomeProducts");
    return response.data;
  } catch (error) {
    console.error("Error fetching home products:", error);
    throw error;
  }
};