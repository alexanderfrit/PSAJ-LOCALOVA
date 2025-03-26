import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Cache for admin emails to reduce database queries
 */
let adminEmailsCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Checks if a user email is in the admin list
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} - Whether the email belongs to an admin
 */
export const isAdmin = async (email) => {
  if (!email) return false;
  
  // First check the primary admins from environment variables
  const primaryAdmins = import.meta.env.VITE_ADMIN_KEY?.split(',').map(email => email.trim()) || [];
  if (primaryAdmins.includes(email)) return true;
  
  // Then check additional admins in Firestore
  // Use cache if it's still valid
  const now = Date.now();
  if (adminEmailsCache && now - lastCacheTime < CACHE_DURATION) {
    return adminEmailsCache.includes(email);
  }
  
  // Otherwise query Firestore
  try {
    const adminsCollection = collection(db, "admins");
    const q = query(adminsCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) return true;
    
    // Update cache with all admins for future checks
    const allAdminsSnapshot = await getDocs(adminsCollection);
    adminEmailsCache = allAdminsSnapshot.docs.map(doc => doc.data().email);
    lastCacheTime = now;
    
    return adminEmailsCache.includes(email);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Sync version for non-async contexts - only checks env vars
 * Not as complete as the async version but useful in some contexts
 */
export const isAdminSync = (email) => {
  if (!email) return false;
  const primaryAdmins = import.meta.env.VITE_ADMIN_KEY?.split(',').map(email => email.trim()) || [];
  return primaryAdmins.includes(email);
};