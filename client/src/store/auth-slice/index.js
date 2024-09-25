import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null
}

// action for register user - create asyncthunk 
export const registerUser = createAsyncThunk('/auth/register',
    async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/register`,
            formData,
            { withCredentials: true }
        );

        return response.data;
    }
)

// action for login user - create asyncthunk
export const loginUser = createAsyncThunk('/auth/login',
    async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            formData,
            { withCredentials: true }
        );

        return response.data;
    }
)

// create action for auth middleware
// commenting this because it is not qorking after deploying on render or we need to buy custom domain to run this
// export const checkAuth = createAsyncThunk('/auth/checkauth',
//     async () => {
//         const response = await axios.get(
//             `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
//             {
//                 withCredentials: true,
//                 headers: {
//                     'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
//                 }
//             }
//         );

//         return response.data;
//     }
// );

// using another method to fix this issue which is comming after deploying on render
export const checkAuth = createAsyncThunk('/auth/checkauth',
    async (token) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                }
            }
        );

        return response.data;
    }
);

export const logoutUser = createAsyncThunk('/auth/logout',
    async () => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`,
            {},
            { withCredentials: true }
        );

        return response.data;
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => { },
        resetTokenAndCredentials: (state, action) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null; // keep this null we dont want to store in state
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
                state.token = action.payload.token;

                sessionStorage.setItem('token', JSON.stringify(action.payload.token));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
    }
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer;