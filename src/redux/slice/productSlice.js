import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   products: (() => {
      try {
         const storedProducts = localStorage.getItem('products');
         return storedProducts ? JSON.parse(storedProducts) : [];
      } catch (error) {
         console.error("Error parsing products from localStorage:", error);
         return [];
      }
   })(),
   minPrice: 0,
   maxPrice: 0,
};

const productSlice = createSlice({
   name: "product",
   initialState,
   reducers: {
      storeProducts(state, action) {
         const prices = action.payload.products.map((product) => product.price);
         const max = Math.max(...prices);
         const min = Math.min(...prices);

         state.products = action.payload.products;
         state.minPrice = min;
         state.maxPrice = max;

         try {
            localStorage.setItem('products', JSON.stringify(action.payload.products));
         } catch (error) {
            console.error("Error saving products to localStorage:", error);
         }
      },
      getPriceRange(state, action) {
         const { products } = action.payload;
         const priceArray = products.map((item) => item.price);
         const max = Math.max(...priceArray);
         const min = Math.min(...priceArray);
         state.minPrice = min;
         state.maxPrice = max;
      },
   },
});

export const { storeProducts, getPriceRange } = productSlice.actions;

export default productSlice.reducer;
