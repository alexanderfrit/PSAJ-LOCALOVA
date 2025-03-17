require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const midtransClient = require('midtrans-client');

const app = express();

// CORS configuration
const corsOptions = {
	origin: 'https://psaj-localova.vercel.app',
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	credentials: true,
	optionsSuccessStatus: 200
};

// Apply middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Production setup
if (process.env.NODE_ENV === "production") {
	app.use(express.static("build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "build", "index.html"));
	});
}

// Create Snap API instance
const snap = new midtransClient.Snap({
	isProduction: false,
	serverKey: process.env.MIDTRANS_SERVER_KEY,
	clientKey: process.env.MIDTRANS_CLIENT_KEY
});

app.get("/", (req, res) => {
	res.send("Welcome to Eshop");
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
			credit_card: {
				secure: true
			},
			callbacks: {
				finish: `${process.env.FRONTEND_URL}/checkout-success`,
				error: `${process.env.FRONTEND_URL}/checkout-failed`,
			},
			enable_payments: [
				"credit_card", "bca_va", "bni_va", "bri_va", 
				"mandiri_va", "permata_va", "gopay", "shopeepay",
				"dana", "ovo"
			]
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
