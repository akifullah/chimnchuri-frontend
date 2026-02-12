import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const user = action.payload;
            state.user = user;
            state.isAuthenticated = true;
            localStorage.setItem("auth", JSON.stringify({ user, isAuthenticated: true }));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("auth");
        },

        setProfile: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.isAuthenticated;
        }
    },
});

export const { setCredentials, logout, setProfile } = authSlice.actions;

export default authSlice.reducer;
