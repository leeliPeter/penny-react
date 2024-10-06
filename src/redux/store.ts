import {configureStore} from '@reduxjs/toolkit';
import isLoginReducer from './isLoginSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        isLogin: isLoginReducer,
        user: userReducer,
    },
    });


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;