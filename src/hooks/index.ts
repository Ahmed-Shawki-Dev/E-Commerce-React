import { useQuery } from "@tanstack/react-query";
import { getProducts, showProductDetails } from "../utils";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

export const useGetProductDetails = (documentId: string) => {
  return useQuery({
queryKey: ["product", documentId],
    queryFn: () => showProductDetails(documentId),
  });
};
