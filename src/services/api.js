const API_URL = 'https://us-central1-umkm-92d73.cloudfunctions.net/api';

export const createPayment = async (data) => {
  const response = await fetch(`${API_URL}/api/create-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
