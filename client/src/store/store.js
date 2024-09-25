import { configureStore } from "@reduxjs/toolkit";

import authReducer from './auth-slice';

import adminProductsSlice from './admin/products-slice';
import adminOrderSlice from './admin/order-slice';

import shoppingProductsSlice from './shop/products-slice';
import shoppingCartSlice from './shop/cart-slice';
import shoppingAddressSlice from './shop/address-slice';
import shoppingOrderSlice from './shop/order-slice';
import shoppingSearchSlice from './shop/search-slice';
import shoppingReviewSlice from './shop/review-slice';

import commonFeatureSlice from './common-slice';

const store = configureStore({
    reducer: {
        auth: authReducer,

        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,

        shopProducts: shoppingProductsSlice,
        shopCart: shoppingCartSlice,
        shopAddress: shoppingAddressSlice,
        shopOrder: shoppingOrderSlice,
        shopSearch: shoppingSearchSlice,
        shopReview: shoppingReviewSlice,

        commonFeature: commonFeatureSlice
    }
});

export default store;