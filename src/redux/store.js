import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import productReducer from "./slice/productSlice";
import filterReducer from "./slice/filterSlice";
import cartReducer from "./slice/cartSlice";
import checkoutReducer from "./slice/checkoutSlice";
import orderReducer from "./slice/orderSlice";
import userReducer from "./slice/userSlice";

export const store = configureStore({
   reducer: {
      auth: authReducer,
      product: productReducer,
      filter: filterReducer,
      cart: cartReducer,
      checkout: checkoutReducer,
      order: orderReducer,
      user: userReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});

export default store;
