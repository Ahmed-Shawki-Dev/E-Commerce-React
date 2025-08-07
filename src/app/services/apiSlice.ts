import { BASE_URL } from "@/config/index.config";
import type { ICategory, IProduct } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface IProductResponse {
  data: IProduct[];
}

interface ICategoryResponse {
  data: ICategory[];
}

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Products"],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = CookieService.get("jwt");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getDashboardProducts: builder.query<IProductResponse, void>({
      query: () => ({
        url: `/api/products?populate=thumbnail&populate=category`,
      }),
      providesTags: ["Products"],
    }),
    getCategories: builder.query<ICategoryResponse, void>({
      query: () => ({
        url: "/api/categories",
        providesTags: ["Categories"],
      }),
    }),

    deleteDashboardProduct: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/api/products/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    addProduct: builder.mutation<{ data: IProduct }, { data: IProduct }>({
      query: ({ data }) => ({
        url: `/api/products`,
        method: "POST",
        body: { data },
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      { data: IProduct },
      { productId: string; data: IProduct }
    >({
      query: ({ productId, data }) => ({
        url: `/api/products/${productId}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetDashboardProductsQuery,
  useGetCategoriesQuery,
  useDeleteDashboardProductMutation,
  useAddProductMutation,
  useUpdateProductMutation,
} = apiSlice;
