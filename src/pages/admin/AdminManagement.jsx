import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import { toastConfig } from "../../utils/toastConfig";
import { isAdmin } from "../../utils/adminUtils";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { email: currentUserEmail } = useSelector((store) => store.auth);
  
  // Define the primary admin (cannot be removed)
  const primaryAdmin = import.meta.env.VITE_ADMIN_KEY.split(',')[0].trim();
  
  // Check if current user is the primary admin
  const isPrimaryAdmin = currentUserEmail === primaryAdmin;
  
  // Fetch admins from Firestore
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const adminsCollection = collection(db, "admins");
      const snapshot = await getDocs(adminsCollection);
      const adminsList = snapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email
      }));
      
      // Add primary admin from env if not already in the list
      if (!adminsList.some(admin => admin.email === primaryAdmin)) {
        adminsList.unshift({
          id: "primary",
          email: primaryAdmin,
          isPrimary: true
        });
      }
      
      setAdmins(adminsList);
    } catch (error) {
      toast.error("Failed to load admin list", toastConfig.error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAdmins();
  }, []);
  
  // Add a new admin
  const addAdmin = async (e) => {
    e.preventDefault();
    
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      toast.error("Please enter a valid email address", toastConfig.error);
      return;
    }
    
    if (admins.some(admin => admin.email === newAdminEmail)) {
      toast.error("This admin already exists", toastConfig.error);
      return;
    }
    
    setLoading(true);
    try {
      const adminsCollection = collection(db, "admins");
      await addDoc(adminsCollection, {
        email: newAdminEmail.trim(),
        addedBy: currentUserEmail,
        addedAt: new Date()
      });
      
      toast.success("Admin added successfully", toastConfig.success);
      setNewAdminEmail("");
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to add admin", toastConfig.error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Remove an admin
  const removeAdmin = async (adminId, adminEmail) => {
    if (adminEmail === primaryAdmin) {
      toast.error("Cannot remove the primary admin", toastConfig.error);
      return;
    }
    
    if (adminEmail === currentUserEmail) {
      toast.error("You cannot remove yourself as an admin", toastConfig.error);
      return;
    }
    
    if (!confirm(`Are you sure you want to remove ${adminEmail} as an admin?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const adminDoc = doc(db, "admins", adminId);
      await deleteDoc(adminDoc);
      
      toast.success("Admin removed successfully", toastConfig.success);
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to remove admin", toastConfig.error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-2xl font-semibold mb-6">Admin Management</h1>
      
      {/* Only primary admin can add other admins */}
      {isPrimaryAdmin && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Add New Admin</h2>
          <form onSubmit={addAdmin} className="flex gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="flex-1 border border-base-300 rounded-md px-4 py-2"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-focus transition-colors flex items-center gap-2"
            >
              <RiAddLine className="w-5 h-5" />
              <span>Add Admin</span>
            </button>
          </form>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-base-300">
          <thead className="bg-base-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              {isPrimaryAdmin && (
                <th className="px-6 py-4 text-right text-sm font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-base-300">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-base-100/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{admin.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {admin.email === primaryAdmin ? (
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">Primary Admin</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full">Admin</span>
                  )}
                </td>
                {isPrimaryAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {admin.email !== primaryAdmin && (
                      <button
                        onClick={() => removeAdmin(admin.id, admin.email)}
                        disabled={loading}
                        className="text-error hover:bg-error/10 p-2 rounded-full transition-colors"
                      >
                        <RiDeleteBinLine className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            
            {admins.length === 0 && (
              <tr>
                <td 
                  colSpan={isPrimaryAdmin ? 3 : 2} 
                  className="px-6 py-8 text-center text-neutral-400"
                >
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminManagement; 