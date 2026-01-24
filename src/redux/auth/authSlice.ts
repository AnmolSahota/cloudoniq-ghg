import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAPI, logoutAPI } from "./authAPI";
import {
  decodeToken,
  extractPermissions,
  setToken,
  removeToken,
} from "../../utils/tokenUtils";
import { Permission } from "../../types/auth.types";

interface AuthState {
  user: any;
  token: string | null;
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  permissions: [],
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await loginAPI(payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutAPI();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.token;
        const decoded = decodeToken(token);

        state.user = action.payload.user;
        state.token = token;
        state.permissions = decoded
          ? extractPermissions(decoded)
          : [];

        setToken(token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.permissions = [];
        removeToken();
      });
  },
});

export default authSlice.reducer;



// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { loginAPI, logoutAPI } from "./authAPI";

// interface AuthState {
//   user: any;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   loading: false,
//   error: null,
// };

// export const login = createAsyncThunk(
//   "auth/register",
//   async (payload: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const res = await loginAPI(payload);
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// export const logout = createAsyncThunk("auth/logout", async () => {
//   await logoutAPI();
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//       });
//   },
// });

// export default authSlice.reducer;
