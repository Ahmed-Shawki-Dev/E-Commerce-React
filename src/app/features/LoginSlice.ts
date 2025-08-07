import { axiosInstance } from "@/config/index.config";
import type { ILoginResponse } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { createStandaloneToast } from "@chakra-ui/react";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const { toast } = createStandaloneToast();
export const fetchLoginData = createAsyncThunk<
  ILoginResponse,
  { identifier: string; password: string },
  { rejectValue: string }
>("login/fetchLoginData", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/local", credentials);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.error?.message);
    }
  }
});

interface IInitialState {
  data: ILoginResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  data: null,
  isLoading: false,
  error: null,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLoginData.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLoginData.fulfilled, (state, action) => {
      state.data = action.payload;
      console.log(action.payload);
      state.isLoading = false;
      CookieService.set("jwt", action.payload.jwt, {
        path: "/",
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
      setTimeout(() => {
        location.replace("/");
      }, 1000);
      toast({
        title: "Logged in",
        description: `Welcome ${action.payload.user.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
    builder.addCase(fetchLoginData.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.payload);
      state.error = action.payload ?? "Unexpected error";
      toast({
        title: "Login failed",
        description:
          (action.payload as string) || "Something went wrong, try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    });
  },
});

export default loginSlice.reducer;
