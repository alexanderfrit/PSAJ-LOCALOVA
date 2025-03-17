const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.VITE_MIDTRANS_SERVER_KEY,
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY
});

app.post('/api/create-payment', async (req, res) => {
  const { orderItems, totalAmount, userEmail, shippingAddress, orderId } = req.body;

  try {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount
      },
      customer_details: {
        email: userEmail,
        shipping_address: {
          first_name: shippingAddress.name,
          phone: shippingAddress.phone,
          address: `${shippingAddress.line1}, ${shippingAddress.line2}`,
          city: shippingAddress.city,
          postal_code: shippingAddress.pin_code,
          country_code: 'IDN'
        }
      },
      custom: {
        ui: {
          theme: {
            primary_color: '#4f46e5',       // Your primary color
            secondary_color: '#6366f1',     // Your secondary color
            font_family: 'Inter, sans-serif',
            font_size: '16px',
            sharp_corners: true
          },
          css: {
            '.header': {
              'border-radius': '0',
              'box-shadow': 'none'
            },
            '.payment-list-item': {
              'border-radius': '8px',
              'margin': '8px 0'
            },
            '.btn-primary': {
              'border-radius': '6px',
              'font-weight': '600'
            }
          }
        }
      },
      callbacks: {
        finish: `${process.env.VITE_FRONTEND_URL}/checkout-success`,
        error: `${process.env.VITE_FRONTEND_URL}/checkout-failed`,
      }
    };

    const transaction = await snap.createTransaction(parameter);
    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 