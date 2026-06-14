import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: { ...order },
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/myorders`,
            }),
            keepUnusedDataFor: 5,
        }),
        getAllOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status }) => ({
                url: `${ORDERS_URL}/${orderId}/status`,
                method: 'PUT',
                body: { status },
            }),
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetMyOrdersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
} = ordersApiSlice;