import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/formatPrice";
import { RiEdit2Line, RiDeleteBinLine, RiSearchLine, RiInformationLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useFetchCollection from "../../hooks/useFetchCollection";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { storeProducts } from "../../redux/slice/productSlice";
import { filterBySearch } from "../../redux/slice/filterSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toastConfig } from "../../utils/toastConfig";
import { categories } from "../../utils/adminProductCategories";

const ViewProducts = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { data, isLoading } = useFetchCollection("products");
  const { filteredProducts } = useSelector((store) => store.filter);
  const { products } = useSelector((store) => store.product);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(storeProducts({ products: data }));
  }, [dispatch, data]);

  useEffect(() => {
    dispatch(filterBySearch({ products: data, search }));
  }, [dispatch, data, search]);

  const confirmDelete = (id, imageURL) => {
    setProductToDelete({ id, imageURL });
    setIsConfirmOpen(true);
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setProductToDelete(null);
  };

  const deleteSingleProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteDoc(doc(db, "products", productToDelete.id));
      const storageRef = ref(storage, productToDelete.imageURL);
      await deleteObject(storageRef);
      toast.success("Product deleted successfully", toastConfig.success);
      setIsConfirmOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error("Error deleting product", toastConfig.error);
      setIsConfirmOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pt-4 sm:pt-6"
    >
      {/* Header Section - Improved Responsive Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-2xl font-serif text-neutral">Products Overview</h1>
          <p className="text-neutral/60">
            {filteredProducts.length} products found
          </p>
        </motion.div>

        {/* Search Bar - Full Width on Mobile */}
        <motion.div
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          className="relative w-full sm:w-auto"
        >
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/40 w-5 h-5" />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-neutral"
          />
        </motion.div>
      </div>

      {/* Products Display - Table on Desktop, Cards on Mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-base-100 border border-base-300"
      >
        {/* Desktop Table View - Hidden on Small Screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base-300">
                <th className="py-4 px-6 text-left text-sm font-medium text-neutral/60 uppercase tracking-wider">#</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-neutral/60 uppercase tracking-wider">Image</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-neutral/60 uppercase tracking-wider">Name</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-neutral/60 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-neutral/60 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-neutral/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  variants={itemVariants}
                  className="hover:bg-base-200/50"
                >
                  <td className="py-4 px-6 text-sm text-neutral">{index + 1}</td>
                  <td className="py-4 px-6">
                    <LazyLoadImage
                      src={product.imageURL}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                      placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
                      effect="blur"
                    />
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-neutral">{product.name}</td>
                  <td className="py-4 px-6 text-sm text-neutral">
                    {categories.find(cat => cat.id.toString() === product.category)?.name || product.category}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-primary">{formatPrice(product.price)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/admin/add-product/${product.id}`}
                        className="p-2 text-secondary hover:text-primary transition-colors"
                      >
                        <RiEdit2Line className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => confirmDelete(product.id, product.imageURL)}
                        className="p-2 text-error hover:text-error-focus transition-colors"
                      >
                        <RiDeleteBinLine className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Shown only on Small Screens */}
        <div className="md:hidden divide-y divide-base-300">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <LazyLoadImage
                  src={product.imageURL}
                  alt={product.name}
                  className="w-16 h-16 object-cover"
                  placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
                  effect="blur"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral truncate">{product.name}</h3>
                  <p className="text-sm text-neutral/60">
                    {categories.find(cat => cat.id.toString() === product.category)?.name || product.category}
                  </p>
                  <p className="text-primary font-medium mt-1">{formatPrice(product.price)}</p>
                </div>
              </div>
              
              <div className="flex justify-end border-t border-base-300 pt-3">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/admin/add-product/${product.id}`}
                    className="px-3 py-1.5 text-secondary border border-secondary hover:bg-secondary hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RiEdit2Line className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => confirmDelete(product.id, product.imageURL)}
                    className="px-3 py-1.5 text-error border border-error hover:bg-error hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RiDeleteBinLine className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="text-lg text-neutral/60">No products found</p>
            <p className="text-sm text-neutral/40 mt-2">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-neutral/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-base-300 p-6 max-w-md w-full"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-error/10 rounded-full">
                <RiInformationLine className="w-6 h-6 text-error" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-neutral">Confirm Deletion</h3>
                <p className="mt-2 text-neutral/70">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                
                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-base-300 text-neutral hover:bg-base-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteSingleProduct}
                    className="px-4 py-2 bg-error text-white hover:bg-error-focus transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ViewProducts;
