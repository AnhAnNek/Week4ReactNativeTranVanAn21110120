import { get, post } from '../utils/httpRequest';

const SUFFIX_PAYMENT_API_URL = '/orders';

const getOrders = async (username, page = 0, size = 8) => {
    const path = `${SUFFIX_PAYMENT_API_URL}/${username}`;
    const response = await get(path, {
        params: {
            page,
            size
        }
    });

    return response?.status === 200 ? response.data : null;
}

const getOrdersByStatus = async (username, status, page = 0, size = 8) => {
    const path = `${SUFFIX_PAYMENT_API_URL}/${username}/status/${status}`;
    const response = await get(path, {
        params: {
            page,
            size
        }
    });

    return response?.status === 200 ? response.data : null;
}

const getOrderItemsByOrderId = async (orderId, page = 0, size = 8) => {
    const path = `${SUFFIX_PAYMENT_API_URL}/${orderId}/items`;
    const response = await get(path, {
        params: {
            page,
            size
        }
    });

    return response?.status === 200 ? response.data : null;
}

const getTotalAmount = async (status) => {
    const path = `${SUFFIX_PAYMENT_API_URL}/total-amount/${status}`;
    const response = await get(path);
    return response?.status === 200 ? response.data : null;
}

const orderService = {
    getOrders,
    getOrdersByStatus,
    getOrderItemsByOrderId,
    getTotalAmount,
}

export default orderService;