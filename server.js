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
			// Load MobileNet V3 Small model
			model = await tf.loadGraphModel(
				'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1',
				{ fromTFHub: true }
			);
			console.log('TensorFlow MobileNet V3 model loaded successfully');
		} catch (error) {
			console.error('Error loading TensorFlow model:', error);
			
			// Fallback to V1 if needed
			try {
				model = await tf.loadLayersModel(
					'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
				);
				console.log('Fallback to MobileNet V1 successful');
			} catch (fallbackError) {
				console.error('All model loading failed:', fallbackError);
				throw new Error('Failed to load AI model');
			}
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
		
		// Create tensor with MobileNet V3 normalization: (pixel - 127.5) / 127.5
		const pixelData = new Float32Array(width * height * channels);
		
		for (let i = 0; i < data.length; i++) {
			pixelData[i] = (data[i] - 127.5) / 127.5;
		}
		
		// Create tensor with proper shape
		const tensor = tf.tensor3d(pixelData, [height, width, channels]);
		return tensor.expandDims(0);
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

// Enhanced similarity function that weights middle features more heavily
function enhancedSimilarity(featureA, featureB) {
	// Basic cosine similarity
	const baseSimilarity = cosineSimilarity(featureA, featureB);
	
	// MobileNet V3 has improved feature representations
	// Extract different parts to weight properly
	const midLayerStart = Math.floor(featureA.length * 0.3);
	const midLayerEnd = Math.floor(featureA.length * 0.7);
	
	const midLayerFeaturesA = featureA.slice(midLayerStart, midLayerEnd);
	const midLayerFeaturesB = featureB.slice(midLayerStart, midLayerEnd);
	
	// Early features (basic shapes, edges)
	const earlyFeaturesA = featureA.slice(0, Math.floor(featureA.length * 0.25));
	const earlyFeaturesB = featureB.slice(0, Math.floor(featureB.length * 0.25));
	
	// Later features (higher-level concepts)
	const lateFeaturesA = featureA.slice(Math.floor(featureA.length * 0.75));
	const lateFeaturesB = featureB.slice(Math.floor(featureB.length * 0.75));
	
	const midLayerSimilarity = cosineSimilarity(midLayerFeaturesA, midLayerFeaturesB);
	const earlyLayerSimilarity = cosineSimilarity(earlyFeaturesA, earlyFeaturesB);
	const lateLayerSimilarity = cosineSimilarity(lateFeaturesA, lateFeaturesB);
	
	// Weight the different feature representations appropriately for furniture
	return baseSimilarity * 0.2 + midLayerSimilarity * 0.5 + 
		   earlyLayerSimilarity * 0.1 + lateLayerSimilarity * 0.2;
}

// Updated findSimilarProducts function with adaptive thresholding
async function findSimilarProducts(products, searchFeatures, limit, threshold) {
	// Process each product and compute similarity
	const similarities = await Promise.all(
		products.map(async (product) => {
			try {
				// Get product features
				let productFeatures;
				if (product.imageFeatures) {
					productFeatures = product.imageFeatures;
				} else {
					productFeatures = await extractFeaturesFromUrl(product.imageURL);
				}
				
				// Use enhanced similarity calculation
				const similarity = enhancedSimilarity(searchFeatures, productFeatures);
				return { product, similarity };
			} catch (error) {
				console.error(`Error processing product ${product.id}:`, error);
				return { product, similarity: 0 };
			}
		})
	);
	
	// Calculate adaptive threshold based on distribution
	const allSimilarities = similarities.map(item => item.similarity);
	const meanSimilarity = allSimilarities.reduce((a, b) => a + b, 0) / allSimilarities.length;
	const stdDev = Math.sqrt(
		allSimilarities.reduce((sq, n) => sq + Math.pow(n - meanSimilarity, 2), 0) / allSimilarities.length
	);
	
	// Use distribution to set cutoff (more adaptive)
	const adaptiveThreshold = meanSimilarity + (0.5 * stdDev);
	const thresholdToUse = Math.max(threshold, adaptiveThreshold);
	
	// Filter, sort and return results with metrics
	const results = similarities
		.filter(item => item.similarity > thresholdToUse)
		.sort((a, b) => b.similarity - a.similarity)
		.slice(0, limit);
		
	// Calculate category coverage
	const categories = new Set();
	results.forEach(item => {
		if (item.product.category) categories.add(item.product.category);
	});
	
	return {
		items: results.map(item => ({
			id: item.product.id,
			name: item.product.name,
			price: item.product.price,
			imageURL: item.product.imageURL,
			category: item.product.category,
			productURL: `https://psaj-localova.vercel.app/product-details/${item.product.id}`,
			similarity: item.similarity.toFixed(3)
		})),
		metrics: {
			averageSimilarity: results.length > 0 
				? (results.reduce((sum, item) => sum + item.similarity, 0) / results.length).toFixed(3)
				: 0,
			adaptiveThreshold: thresholdToUse.toFixed(3),
			categoryCoverage: categories.size
		}
	};
}

// Update your API endpoints to return the metrics
app.post('/api/search/url', async (req, res) => {
	try {
		const { imageUrl, limit = 8, threshold = 0.2 } = req.body;
		
		if (!imageUrl) {
			return res.status(400).json({ error: 'Image URL is required' });
		}
		
		// Get products from your database
		const productsCollection = collection(firestore, 'products');
		const productsSnapshot = await getDocs(productsCollection);
		const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		
		// Extract features from the search image
		const searchFeatures = await extractFeaturesFromUrl(imageUrl);
		
		// Get results with metrics
		const results = await findSimilarProducts(products, searchFeatures, limit, threshold);
		
		res.json({ 
			results: results.items,
			metrics: results.metrics
		});
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
				imageURL: p.imageURL,
				productURL: `https://psaj-localova.vercel.app/product-details/${p.id}`
			}))
		});
	} catch (error) {
		console.error('Error in simple image search:', error);
		res.status(500).json({ error: error.message || 'Failed to process request' });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));