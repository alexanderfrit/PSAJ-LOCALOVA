/**
 * Checks if a user email is in the admin list
 * @param {string} email - The email to check
 * @returns {boolean} - Whether the email belongs to an admin
 */
export const isAdmin = (email) => {
  if (!email) return false;
  
  const adminEmails = import.meta.env.VITE_ADMIN_KEY?.split(',').map(email => email.trim()) || [];
  return adminEmails.includes(email);
};