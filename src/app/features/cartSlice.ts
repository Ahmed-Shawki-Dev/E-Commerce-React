import type { ICart } from "@/interfaces";
import { addToCart } from "@/utils";
import { createStandaloneToast } from "@chakra-ui/react";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const { toast } = createStandaloneToast();

interface IState {
  cartItems: ICart[];
}

const initialState: IState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartAction: (state, action: PayloadAction<ICart>) => {
      state.cartItems = addToCart(state.cartItems, action.payload);
    },

    clearCartAction: (state) => {
      if (state.cartItems.length !== 0) {
        state.cartItems = [];
        toast({
          title: "Cart Deleted Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    },

    removeItemFromCartAction: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.documentId !== action.payload,
      );
      toast({
        title: "Item Removed From Your Cart Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    },
  },
});

export const { addToCartAction, clearCartAction, removeItemFromCartAction } =
  cartSlice.actions;

export default cartSlice.reducer;
