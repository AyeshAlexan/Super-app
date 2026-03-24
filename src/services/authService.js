import API from "./api";

//LOGIN
export const loginUser = (data) => {
  return API.post("/login", data);
};

// REGISTER
export const registerUser = (data) => {
  return API.post("/register", data);
};