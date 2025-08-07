import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartDrawerOpen: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.isCartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
  },
});

export const { openCartDrawer, closeCartDrawer, toggleCartDrawer } =
  globalSlice.actions;

export default globalSlice.reducer;
