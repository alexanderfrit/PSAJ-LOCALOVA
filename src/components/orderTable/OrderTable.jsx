import { Link } from "react-router-dom";
// lazy load
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { formatPrice } from "../../utils/formatPrice";
import { motion } from "framer-motion";
import { RiShoppingBag3Line, RiArrowRightSLine } from "react-icons/ri";

const OrderTable = ({ order }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut" 
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {/* Order Summary Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-base-300"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-serif text-neutral">Order Summary</h2>
          <p className="text-neutral/60">
            {order.cartItems.length} {order.cartItems.length === 1 ? 'item' : 'items'} in your order
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral/60">Order Total</p>
          <p className="text-2xl font-medium text-primary">
            {formatPrice(order.orderAmount)}
          </p>
        </div>
      </motion.div>

      {/* Products List for Mobile */}
      <div className="block sm:hidden">
        <motion.div variants={containerVariants} className="space-y-4">
          {order.cartItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white border border-base-300 p-4"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 border border-base-300 flex-shrink-0">
                  <LazyLoadImage
                    src={item.imageURL}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    effect="blur"
                    placeholderSrc="https://placehold.co/80x80?text=Loading..."
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral">{item.name}</h3>
                  <p className="text-sm text-neutral/60 mb-2">{item.brand}</p>
                  
                  <div className="flex justify-between mt-2">
                    <div className="text-sm">
                      <span className="text-neutral/60">Price: </span>
                      <span className="font-medium">{formatPrice(item.price)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-neutral/60">Qty: </span>
                      <span className="font-medium">{item.qty}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <div className="text-primary font-medium">
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Products Table for Tablets & Desktops */}
      <div className="hidden sm:block overflow-x-auto">
        <motion.table variants={itemVariants} className="w-full">
          <thead>
            <tr className="bg-base-200/50">
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral/70 uppercase tracking-wider">
                Product
              </th>
              <th className="py-5 px-6 text-right text-sm font-medium text-neutral/70 uppercase tracking-wider">
                Price
              </th>
              <th className="py-5 px-6 text-right text-sm font-medium text-neutral/70 uppercase tracking-wider">
                Quantity
              </th>
              <th className="py-5 px-6 text-right text-sm font-medium text-neutral/70 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-300">
            {order.cartItems.map((item, index) => (
              <motion.tr
                key={index}
                variants={itemVariants}
                className="group hover:bg-base-200/20 transition-colors"
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 border border-base-300 bg-base-200/30">
                      <LazyLoadImage
                        src={item.imageURL}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        effect="blur"
                        placeholderSrc="https://placehold.co/64x64?text=Loading..."
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral/60">
                        {item.brand}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-right align-middle">
                  <span className="text-neutral font-medium">
                    {formatPrice(item.price)}
                  </span>
                </td>
                <td className="py-5 px-6 text-right align-middle">
                  <span className="inline-flex items-center justify-center w-10 h-8 bg-base-200/30 text-neutral">
                    {item.qty}
                  </span>
                </td>
                <td className="py-5 px-6 text-right align-middle">
                  <span className="font-medium text-primary">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-base-200/50 border-t border-base-300">
              <td colSpan="3" className="py-5 px-6 text-right font-medium text-neutral">
                Total Amount
              </td>
              <td className="py-5 px-6 text-right">
                <span className="text-xl font-bold text-primary">
                  {formatPrice(order.orderAmount)}
                </span>
              </td>
            </tr>
          </tfoot>
        </motion.table>
      </div>

      {/* Empty State */}
      {order.cartItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center bg-white"
        >
          <RiShoppingBag3Line className="w-16 h-16 mx-auto text-neutral/20" />
          <h3 className="mt-6 text-xl font-medium text-neutral">No Items in Order</h3>
          <p className="mt-2 text-neutral/60 mb-8">This order appears to be empty</p>
          
          <Link to="/shop" className="inline-flex items-center text-primary hover:text-primary-focus">
            <span>Browse Products</span>
            <RiArrowRightSLine className="ml-1 w-5 h-5" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderTable;
