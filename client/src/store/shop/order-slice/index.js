import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    approvalUrl: null,
    orderId: null,
    orderList: [],
    orderDetails: null
};

export const createNewOrder = createAsyncThunk('/order/createNewOrder',
    async (orderData) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/create`, orderData);
        return response.data;
    }
)

export const capturePayment = createAsyncThunk('/order/capturePayment',
    async ({ paymentId, payerId, orderId }) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
            { paymentId, payerId, orderId }
        );

        return response.data;
    }
)

export const getAllOrdersByUserId = createAsyncThunk('/order/getAllOrdersByUserId',
    async (userId) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`);
        return response.data;
    }
)

export const getOrderdetails = createAsyncThunk('/order/getOrderDetails',
    async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`);
        return response.data;
    }
)

const ShoppingOrderSlice = createSlice({
    name: 'shoppingOrderSlice',
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.approvalUrl = action.payload.approvalUrl;
                state.orderId = action.payload.orderId;
                // store orderId in session as it will not saved in state
                sessionStorage.setItem('currentOrderId', JSON.stringify(action.payload.orderId));
            })
            .addCase(createNewOrder.rejected, (state) => {
                state.isLoading = false;
                state.approvalUrl = null;
                state.orderId = null;
            })
            .addCase(getAllOrdersByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
            })
            .addCase(getAllOrdersByUserId.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
            })
            .addCase(getOrderdetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderdetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderdetails.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
            })
    }
});

export const { resetOrderDetails } = ShoppingOrderSlice.actions;
export default ShoppingOrderSlice.reducer;