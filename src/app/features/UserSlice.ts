import { axiosInstance } from "@/config/index.config";
import type { IUser } from "@/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/users/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      // console.log("Fetch User Response: ",data)
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error?.message);
      }
    }
  },
);

interface IInitialState {
  data: IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IInitialState = {
  data: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    });
  },
});
