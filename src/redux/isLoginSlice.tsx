import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type IsLogin = boolean;

const initialState: IsLogin = true;

export const isLoginSlice = createSlice({
  name: "isLogin",
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<IsLogin>) => {
      return action.payload;
    },
  },
});

export const { setIsLogin } = isLoginSlice.actions;
export default isLoginSlice.reducer;
