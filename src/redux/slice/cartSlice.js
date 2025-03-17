import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { toastConfig } from "../../utils/toastConfig";

const initialState = {
   cartItems: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
   totalQuantity: 0,
   totalAmount: 0,
};

const cartSlice = createSlice({
   name: "cart",
   initialState,
   reducers: {
      addToCart: (state, action) => {
         const itemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);
         
         if (itemIndex >= 0) {
            state.cartItems[itemIndex].qty += 1;
            toast.success("Quantity increased", toastConfig.success);
         } else {
            const tempProduct = { ...action.payload, qty: 1 };
            state.cartItems.push(tempProduct);
            toast.success("Item added to cart", toastConfig.success);
         }
         localStorage.setItem("cart", JSON.stringify(state.cartItems));
      },
      
      decreaseCart: (state, action) => {
         const itemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);
         
         if (state.cartItems[itemIndex].qty > 1) {
            state.cartItems[itemIndex].qty -= 1;
            toast.info("Quantity decreased", toastConfig.info);
         } else if (state.cartItems[itemIndex].qty === 1) {
            const newCartItems = state.cartItems.filter((item) => item.id !== action.payload.id);
            state.cartItems = newCartItems;
            toast.error("Item removed from cart", toastConfig.error);
         }
         localStorage.setItem("cart", JSON.stringify(state.cartItems));
      },
      
      removeCartItem: (state, action) => {
         const newCartItems = state.cartItems.filter((item) => item.id !== action.payload.id);
         state.cartItems = newCartItems;
         localStorage.setItem("cart", JSON.stringify(state.cartItems));
         toast.error("Item removed from cart", toastConfig.error);
      },
      
      clearCart: (state) => {
         state.cartItems = [];
         localStorage.setItem("cart", JSON.stringify(state.cartItems));
         toast.error("Cart cleared", toastConfig.error);
      },
      
      calculateSubtotal: (state) => {
         const newArr = [];
         state.cartItems.map((item) => {
            const { price, qty } = item;
            const amount = price * qty;
            newArr.push(amount);
         });
         const totalAmount = newArr.reduce((total, curr) => total + curr, 0);
         state.totalAmount = totalAmount;
      },
      
      calculateTotalQuantity: (state) => {
         let newArr = [];
         state.cartItems.map((item) => {
            newArr.push(item.qty);
         });
         const totalQty = newArr.reduce((total, curr) => total + curr, 0);
         state.totalQuantity = totalQty;
      },
   },
});

export const {
   addToCart,
   decreaseCart,
   removeCartItem,
   clearCart,
   calculateSubtotal,
   calculateTotalQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
