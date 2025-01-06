import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addUser: { name: "", username: "", email: "" },
  loginUser: {
    isLogged: JSON.parse(localStorage.getItem("isLogged")) || false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { name, username, email } = action.payload;
      state.addUser.name = name;
      state.addUser.username = username;
      state.addUser.email = email;
    },
    logoutUser: (state) => {
      state.loginUser.isLogged = false;
      localStorage.removeItem("isLogged");
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
