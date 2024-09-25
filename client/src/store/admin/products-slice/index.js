import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    productList: [],
};

// create thunk for add new product
export const addNewProduct = createAsyncThunk(
    "/products/addNewProduct",
    async (formData) => {
        const result = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/products/add`,
            formData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        return result?.data;
    }
);

// create thunk for fetch all products
export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async () => {
        const result = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/products/get`
        );
        return result?.data;
    }
);

// create thunk for edit product
export const editProduct = createAsyncThunk(
    "/products/editProduct",
    async ({ id, formData }) => {
        const result = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,
            formData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return result?.data;
    }
);

// create thunk for delete product
export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",
    async (id) => {
        const result = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`
        );
        return result?.data;
    }
);

const AdminProductsSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.isLoading = true;
                state.productList = action.payload.data;
            })
            .addCase(fetchAllProducts.rejected, (state) => {
                state.isLoading = false;
                state.productList = [];
            });
    },
});

export default AdminProductsSlice.reducer;