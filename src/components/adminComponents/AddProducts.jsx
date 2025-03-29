import React, { useState } from "react";
import { toast } from "react-toastify";
import { toastConfig } from "../../utils/toastConfig";
import { RiImageAddLine, RiMoneyDollarCircleLine, RiDashboardLine, RiDeleteBinLine, RiAddLine, RiDatabaseLine, RiLoader4Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "../../utils/adminProductCategories";
import { defaultValues } from "../../utils/adminAddProductDefaultValues";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { storage, db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CategorySelect from "./CategorySelect";
import { generateDummyProducts } from "../../utils/generateDummyProducts";

const detectForm = (paramsId, func1, func2) => (paramsId === "ADD" ? func1 : func2);

const AddProducts = () => {
  const navigate = useNavigate();
  const { id: paramsId } = useParams();
  const { products: reduxProducts } = useSelector((store) => store.product);
  const productEdit = reduxProducts.find((item) => item.id === paramsId);
  const [product, setProduct] = useState(() => detectForm(paramsId, defaultValues, productEdit));
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCount, setBulkCount] = useState(5);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const AllFieldsRequired = Object.values(product).every(value => Boolean(value));

  const formActions = {
    addProduct: async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const docRef = await addDoc(collection(db, "products"), {
          ...product,
          price: Number(product.price),
          createdAt: Timestamp.now().toDate(),
        });
        setProduct(defaultValues);
        toast.success("Product added successfully", toastConfig.success);
        navigate("/admin/all-products");
      } catch (error) {
        toast.error(error.message, toastConfig.error);
      } finally {
        setIsLoading(false);
      }
    },
    editProduct: async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await setDoc(doc(db, "products", paramsId), {
          ...product,
          price: Number(product.price),
          editedAt: Timestamp.now().toDate(),
        });
        toast.success("Product updated successfully", toastConfig.success);
        navigate("/admin/all-products");
      } catch (error) {
        toast.error(error.message, toastConfig.error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBulkAdd = async () => {
    setIsBulkLoading(true);
    setBulkProgress(0);
    
    try {
      const dummyProducts = await generateDummyProducts(bulkCount);
      let addedCount = 0;
      
      for (const product of dummyProducts) {
        await addDoc(collection(db, "products"), {
          ...product,
          price: Number(product.price),
          createdAt: Timestamp.now().toDate(),
        });
        
        addedCount++;
        setBulkProgress(Math.floor((addedCount / bulkCount) * 100));
      }
      
      toast.success(`${bulkCount} products added successfully`, toastConfig.success);
      setShowBulkModal(false);
      navigate("/admin/all-products");
    } catch (error) {
      toast.error(error.message, toastConfig.error);
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Form Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-serif text-neutral mb-2">
            {detectForm(paramsId, "Create New Product", "Edit Product")}
          </h1>
          <p className="text-neutral/60">
            {detectForm(paramsId, "Add a new product to the catalog", "Update existing product details")}
          </p>
        </div>
        
        {/* Only show bulk add button on the ADD page, not edit page */}
        {paramsId === "ADD" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBulkModal(true)}
            className="btn bg-secondary text-secondary-content hover:bg-secondary-focus rounded-none"
          >
            <RiDatabaseLine className="w-5 h-5 mr-2" />
            Bulk Add
          </motion.button>
        )}
      </motion.div>

      {/* Product Form */}
      <form 
        onSubmit={detectForm(paramsId, formActions.addProduct, formActions.editProduct)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral/60 flex items-center gap-2">
              <RiDashboardLine className="w-4 h-4" />
              Product Name
            </label>
            <input
              className="input input-bordered w-full rounded-none focus:border-primary"
              type="text"
              placeholder="Enter product name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Product Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral/60 flex items-center gap-2">
              <RiMoneyDollarCircleLine className="w-4 h-4" />
              Price
            </label>
            <input
              className="input input-bordered w-full rounded-none focus:border-primary"
              type="number"
              placeholder="Enter price"
              name="price"
              value={product.price}
              onChange={handleInputChange}
            />
          </div>

          {/* Product Category - Replace with CategorySelect component */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral/60">Category</label>
            <CategorySelect 
              value={product.category} 
              onChange={handleInputChange}
            />
          </div>

          {/* Product Brand */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral/60">Brand</label>
            <input
              className="input input-bordered w-full rounded-none focus:border-primary"
              type="text"
              placeholder="Enter brand"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Image URL & Preview */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral/60 flex items-center gap-2">
              <RiImageAddLine className="w-4 h-4" />
              Image URL
            </label>
            <input
              className="input input-bordered w-full rounded-none focus:border-primary"
              type="url"
              placeholder="Enter image URL"
              name="imageURL"
              value={product.imageURL}
              onChange={handleInputChange}
            />
          </div>
          
          {product.imageURL && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-primary p-4"
            >
              <LazyLoadImage
                src={product.imageURL}
                alt="Product preview"
                className="w-full h-48 object-contain mx-auto"
                effect="blur"
                placeholderSrc="https://via.placeholder.com/400?text=Loading+Image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400?text=Invalid+Image+URL";
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Product Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral/60">Description</label>
          <textarea
            className="textarea textarea-bordered w-full rounded-none focus:border-primary h-32"
            placeholder="Enter product description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`btn w-full rounded-none ${AllFieldsRequired ? 
            'bg-primary text-primary-content hover:bg-primary-focus' : 
            'bg-base-300 text-neutral/40 cursor-not-allowed'}`}
          disabled={!AllFieldsRequired}
        >
          <RiAddLine className="w-5 h-5" />
          {detectForm(paramsId, "Add Product", "Update Product")}
        </motion.button>
      </form>

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-neutral/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 shadow-xl max-w-md w-full"
          >
            <h2 className="text-xl font-serif text-neutral mb-4">Bulk Add Products</h2>
            <p className="text-neutral/60 mb-6">
              Generate and add multiple furniture products with images from Pexels.
            </p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral/60">
                  Number of Products
                </label>
                <input
                  type="number"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  className="input input-bordered w-full rounded-none focus:border-primary"
                />
                <p className="text-xs text-neutral/40">
                  Recommended: 5-10 products at once
                </p>
              </div>
              
              {isBulkLoading && (
                <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>
              )}
              
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBulkModal(false)}
                  disabled={isBulkLoading}
                  className="btn flex-1 rounded-none bg-base-300 text-neutral"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBulkAdd}
                  disabled={isBulkLoading}
                  className="btn flex-1 rounded-none bg-primary text-primary-content hover:bg-primary-focus"
                >
                  {isBulkLoading ? (
                    <>
                      <RiLoader4Line className="w-5 h-5 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <RiAddLine className="w-5 h-5 mr-2" />
                      Generate
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AddProducts;
