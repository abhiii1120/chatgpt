import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authThunk";

const initialState = {
  user:null,
  accessToken:null,
  isAuthenticated:false,
  initialized:false,
  loading:false,
  error:null
}

let authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    tokenUpdated(state,action){
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user ?? state.user
      state.isAuthenticated = true
      state.initialized = true
    },
    clearAuthError(state){
      state.error = null
    }
  },
  extraReducers:(builder) => {
    builder
      .addMatcher(
        (action) => [register.pending , login.pending].some((t) => t.match(action)),
        (state) => {
          state.loading = true
          state.error = null
        }
      )
      .addMatcher(
        (action) => [register.fulfilled,login.fulfilled].some((t) => t.match(action)),
        (state,action) => {
          state.loading = false
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.isAuthenticated = true
          state.initialized = true
          state.error = null
        }
      ).addMatcher(
        (action) => [register.rejected , login.rejected].some((t) => t.match(action)),
        (state,action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  }
});

export const { tokenUpdated, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

export {
  register,
  login,
} from "./authThunk"