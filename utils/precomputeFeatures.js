const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-backend-cpu');
const { collection, getDocs, updateDoc, doc } = require('firebase/firestore');
const { firestore } = require('../your-firebase-config');
const axios = require('axios');
const sharp = require('sharp');

// Load MobileNet model
async function loadModel() {
  try {
    const model = await tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
    );
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

// Helper to convert image to tensor
async function imageToTensor(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(224, 224)
      .toBuffer();
    
    const uint8Array = new Uint8Array(resizedImageBuffer);
    const decodedImage = tf.node.decodeImage(uint8Array, 3);
    const normalized = decodedImage.toFloat().div(tf.scalar(255)).expandDims();
    
    decodedImage.dispose();
    return normalized;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Main function to precompute features
async function precomputeProductFeatures() {
  console.log('Starting feature precomputation...');
  const model = await loadModel();
  
  try {
    const productsCollection = collection(firestore, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`Processing ${products.length} products...`);
    let processed = 0;
    
    for (const product of products) {
      try {
        if (!product.imageURL) {
          console.log(`Skipping product ${product.id} (no image URL)`);
          continue;
        }
        
        // Extract features
        const imageTensor = await imageToTensor(product.imageURL);
        const features = model.predict(imageTensor);
        const featureArray = Array.from(await features.data());
        
        // Clean up
        imageTensor.dispose();
        features.dispose();
        
        // Update product in database
        const productRef = doc(firestore, 'products', product.id);
        await updateDoc(productRef, {
          imageFeatures: featureArray
        });
        
        processed++;
        console.log(`Processed ${processed}/${products.length}: ${product.name}`);
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
      }
    }
    
    console.log(`Feature computation complete. Processed ${processed} products.`);
  } catch (error) {
    console.error('Error precomputing features:', error);
  }
}

// Run the precomputation
precomputeProductFeatures().catch(console.error); 