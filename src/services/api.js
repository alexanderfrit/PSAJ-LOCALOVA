import { ENDPOINTS } from '../config/apiConfig';

export const createPayment = async (data) => {
  const response = await fetch(ENDPOINTS.CREATE_PAYMENT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
