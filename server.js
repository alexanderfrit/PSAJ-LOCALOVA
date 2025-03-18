require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const midtransClient = require('midtrans-client');
const multer = require('multer');
const axios = require('axios');
const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const sharp = require('sharp');
require('@tensorflow/tfjs-backend-cpu');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const app = express();

// CORS configuration
const corsOptions = {
	origin: ['https://psaj-localova.vercel.app', 'chrome-extension://your-extension-id']
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

// Set up multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Global model reference
let model = null;

// Load MobileNet model
async function loadModel() {
	if (!model) {
		try {
			model = await tf.loadLayersModel(
				'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
			);
			console.log('TensorFlow model loaded successfully');
		} catch (error) {
			console.error('Error loading TensorFlow model:', error);
			throw new Error('Failed to load AI model');
		}
	}
	return model;
}

// Initialize model on startup
loadModel().catch(err => console.error('Initial model loading failed:', err));

// Helper to convert image to tensor
async function imageToTensor(imageBuffer) {
	try {
		// Resize image to 224x224 (MobileNet input size)
		const resizedImageBuffer = await sharp(imageBuffer)
			.resize(224, 224)
			.removeAlpha()  // Ensure it's RGB (3 channels)
			.raw()
			.toBuffer({ resolveWithObject: true });
		
		// Get dimensions and data
		const { data, info } = resizedImageBuffer;
		const { width, height, channels } = info;
		
		// Create tensor directly from raw pixel data
		const pixelData = new Float32Array(width * height * channels);
		
		// Convert to float32 and normalize
		for (let i = 0; i < data.length; i++) {
			pixelData[i] = data[i] / 255.0;
		}
		
		// Create tensor with proper shape for MobileNet
		const tensor = tf.tensor3d(pixelData, [height, width, channels]);
		const normalized = tensor.expandDims(0);
		
		tensor.dispose(); // Clean up
		
		return normalized;
	} catch (error) {
		console.error('Error converting image to tensor:', error);
		throw new Error('Failed to process image');
	}
}

// Extract features from an image URL
async function extractFeaturesFromUrl(imageUrl) {
	try {
		const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
		const imageBuffer = Buffer.from(response.data);
		return await extractFeaturesFromBuffer(imageBuffer);
	} catch (error) {
		console.error('Error extracting features from URL:', error);
		throw new Error('Failed to extract features from image URL');
	}
}

// Extract features from an image buffer
async function extractFeaturesFromBuffer(imageBuffer) {
	try {
		const model = await loadModel();
		const imageTensor = await imageToTensor(imageBuffer);
		
		// Get features
		const features = model.predict(imageTensor);
		const featureArray = await features.data();
		
		// Clean up
		imageTensor.dispose();
		features.dispose();
		
		return Array.from(featureArray);
	} catch (error) {
		console.error('Error extracting features from buffer:', error);
		throw new Error('Failed to extract image features');
	}
}

// Calculate cosine similarity
function cosineSimilarity(a, b) {
	const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
	const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
	const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
	return dotProduct / (magnitudeA * magnitudeB);
}

// Add Firebase initialization at the top of your file (after imports)
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

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

// Endpoint for image URL search
app.post('/api/search/url', async (req, res) => {
	try {
		const { imageUrl, limit = 5, threshold = 0.2 } = req.body;
		
		if (!imageUrl) {
			return res.status(400).json({ error: 'Image URL is required' });
		}
		
		// Get products from your database - FIXED VERSION
		const productsCollection = collection(firestore, 'products');
		const productsSnapshot = await getDocs(productsCollection);
		const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		
		// Extract features from the search image
		const searchFeatures = await extractFeaturesFromUrl(imageUrl);
		
		// Compare with product features (using pre-extracted features if available)
		const results = await findSimilarProducts(products, searchFeatures, limit, threshold);
		
		res.json({ results });
	} catch (error) {
		console.error('Error in image search:', error);
		res.status(500).json({ error: error.message || 'Failed to process image search' });
	}
});

// Endpoint for direct image upload
app.post('/api/search/upload', upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No image uploaded' });
		}
		
		const { limit = 5, threshold = 0.2 } = req.body;
		
		// Get products from your database - FIXED VERSION
		const productsCollection = collection(firestore, 'products');
		const productsSnapshot = await getDocs(productsCollection);
		const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		
		// Extract features from the uploaded image
		const searchFeatures = await extractFeaturesFromBuffer(req.file.buffer);
		
		// Find similar products
		const results = await findSimilarProducts(products, searchFeatures, limit, threshold);
		
		res.json({ results });
	} catch (error) {
		console.error('Error in image upload search:', error);
		res.status(500).json({ error: error.message || 'Failed to process image search' });
	}
});

// Helper function to find similar products
async function findSimilarProducts(products, searchFeatures, limit, threshold) {
	// Process each product and compute similarity
	const similarities = await Promise.all(
		products.map(async (product) => {
			try {
				// Get product features - either from database or extract them
				let productFeatures;
				if (product.imageFeatures) {
					// If you've pre-computed features
					productFeatures = product.imageFeatures;
				} else {
					// Extract them on the fly
					productFeatures = await extractFeaturesFromUrl(product.imageURL);
				}
				
				const similarity = cosineSimilarity(searchFeatures, productFeatures);
				return { product, similarity };
			} catch (error) {
				console.error(`Error processing product ${product.id}:`, error);
				return { product, similarity: 0 };
			}
		})
	);
	
	// Filter and sort results
	return similarities
		.filter(item => item.similarity > threshold)
		.sort((a, b) => b.similarity - a.similarity)
		.slice(0, limit)
		.map(item => ({
			id: item.product.id,
			name: item.product.name,
			price: item.product.price,
			imageURL: item.product.imageURL,
			similarity: item.similarity.toFixed(2)
		}));
}

// Simple proxy endpoint that doesn't use TensorFlow on server
app.post('/api/search/url/simple', async (req, res) => {
	try {
		const { imageUrl } = req.body;
		
		if (!imageUrl) {
			return res.status(400).json({ error: 'Image URL is required' });
		}
		
		// Get products from your database - FIXED VERSION
		const productsCollection = collection(firestore, 'products');
		const productsSnapshot = await getDocs(productsCollection);
		const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		
		// Return all products and let frontend handle similarity
		res.json({ 
			imageUrl,
			products: products.map(p => ({
				id: p.id,
				name: p.name,
				price: p.price,
				imageURL: p.imageURL
			}))
		});
	} catch (error) {
		console.error('Error in simple image search:', error);
		res.status(500).json({ error: error.message || 'Failed to process request' });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));