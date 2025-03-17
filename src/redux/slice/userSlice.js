import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserInformation: (state, action) => {
      state.userInfo = action.payload;
      // Save to localStorage
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    getUserInformation: (state) => {
      // Load from localStorage if available
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        state.userInfo = JSON.parse(userInfo);
      }
    },
  },
});

export const { saveUserInformation, getUserInformation } = userSlice.actions;
export default userSlice.reducer; 