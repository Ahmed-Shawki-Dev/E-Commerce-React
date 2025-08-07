import type { ICart } from "@/interfaces";
import { axiosInstance } from "../config/index.config";
import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

export const getProducts = async () => {
  try {
    const { data } = await axiosInstance.get(
      "/products?populate=thumbnail&populate=category&fields=title,description,price",
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const showProductDetails = async (documentId: string) => {
  const { data } = await axiosInstance.get(
    `/products/${documentId}?populate=thumbnail&populate=category&fields=title,description,price`,
  );
  return data;
};

export const trimText = (text: string) => {
  if (text.length > 50) {
    return `${text.slice(0, 50)}...`;
  }
  return text;
};

export const addToCart = (cartItems: ICart[], newItem: ICart): ICart[] => {
  const exists = cartItems.find(
    (item) => item.documentId === newItem.documentId,
  );
  if (exists) {
    toast({
      title: "Added To Your Cart",
      description:
        "This Item Is Already Exists, The Quantity Will Be Increased",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
    return cartItems.map((item) =>
      item.documentId === newItem.documentId
        ? { ...item, qty: item.qty + 1 }
        : item,
    );
  }
  toast({
    title: "Added To Your Cart Successfully",
    status: "success",
    duration: 2000,
    isClosable: true,
    position: "top",
  });
  return [...cartItems, { ...newItem, qty: 1 }];
};
