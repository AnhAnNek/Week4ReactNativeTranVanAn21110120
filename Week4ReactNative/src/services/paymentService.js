import { get, post } from '../utils/httpRequest';
import {put} from "axios";

const SUFFIX_PAYMENT_API_URL = '/payment';

const createPaymentOrder = async (paymentRequest) => {
  const path = `${SUFFIX_PAYMENT_API_URL}/create-payment`;
  const response = await post(path, paymentRequest);

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
}

const getResult = async (params) => {
  const path = `${SUFFIX_PAYMENT_API_URL}/result`;
  const response = await put(path, {
    params
  });

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const simulatePaymentSuccess = async (orderId) => {
  try {
    const path = `${SUFFIX_PAYMENT_API_URL}/simulate-success/${orderId}`;
    const response = await post(path);
    return response.data;
  } catch (error) {
    console.error('Error simulating payment success:', error);
    throw error;
  }
};

const payService = {
  createPaymentOrder,
  getResult,
  simulatePaymentSuccess,
}

export default payService;