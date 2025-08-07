import { BASE_URL } from "@/config/index.config";
import type { ICategory, IDashboardProduct, IProduct } from "@/interfaces";
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

    updateDashboardProduct: builder.mutation<
      { data: IProduct },
      {
        documentId: string;
        body: FormData;
      }
    >({
      query: ({ documentId, body }) => ({
        url: `/api/products/${documentId}`,
        method: "PUT",
        body, // FormData فيها `data` و `files.thumbnail`
      }),

      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    addDashboardProduct: builder.mutation<void, { body: IDashboardProduct }>({
      query: ({ body }) => ({
        url: `/api/products`,
        method: "POST",
        body: { data: body },
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetDashboardProductsQuery,
  useGetCategoriesQuery,
  useDeleteDashboardProductMutation,
  useUpdateDashboardProductMutation,
  useAddDashboardProductMutation,
} = apiSlice;
