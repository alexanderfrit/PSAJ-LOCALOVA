import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../../utils/formatPrice";
import { motion } from "framer-motion";
import { 
  RiShoppingBagLine, 
  RiTruckLine, 
  RiPriceTag3Line, 
  RiShieldCheckLine,
  RiMoneyDollarCircleLine
} from "react-icons/ri";

const CheckoutSummary = () => {
   const { cartItems, totalQuantity, totalAmount } = useSelector(
      (store) => store.cart
   );

   return (
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="space-y-6"
      >
         {/* Order Stats */}
         <div className="grid grid-cols-2 gap-4">
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="bg-base-200/50 p-4 rounded-lg"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                     <RiShoppingBagLine className="text-primary text-lg" />
                  </div>
                  <div>
                     <p className="text-sm text-neutral/60">Items</p>
                     <p className="font-medium text-neutral">{totalQuantity}</p>
                  </div>
               </div>
            </motion.div>

            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.1 }}
               className="bg-base-200/50 p-4 rounded-lg"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                     <RiMoneyDollarCircleLine className="text-primary text-lg" />
                  </div>
                  <div>
                     <p className="text-sm text-neutral/60">Total</p>
                     <p className="font-medium text-neutral">{formatPrice(totalAmount)}</p>
                  </div>
               </div>
            </motion.div>
         </div>

         {/* Order Items */}
         <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="divide-y divide-base-300"
         >
            {cartItems.map((item, index) => (
               <motion.div 
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="flex items-center gap-4 py-4"
               >
                  <div className="relative">
                     <div className="w-16 h-16 bg-base-200/50 rounded-lg overflow-hidden">
                        <img 
                           src={item.imageURL} 
                           alt={item.name}
                           className="w-full h-full object-cover"
                        />
                     </div>
                     <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-medium rounded-full">
                        {item.qty}
                     </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <h3 className="text-sm font-medium text-neutral truncate">
                        {item.name}
                     </h3>
                     <div className="mt-1 flex items-center gap-2 text-sm">
                        <span className="text-neutral/60">{formatPrice(item.price)}</span>
                        <span className="text-neutral/40">×</span>
                        <span className="text-neutral/60">{item.qty}</span>
                        <span className="text-neutral/40">=</span>
                        <span className="font-medium text-primary">
                           {formatPrice(item.price * item.qty)}
                        </span>
                     </div>
                  </div>
               </motion.div>
            ))}
         </motion.div>

         {/* Price Breakdown */}
         <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 border-t border-base-300 pt-4"
         >
            <div className="flex items-center justify-between text-sm">
               <div className="flex items-center gap-2 text-neutral/60">
                  <RiPriceTag3Line className="text-primary" />
                  <span>Subtotal</span>
               </div>
               <span className="font-medium text-neutral">
                  {formatPrice(totalAmount)}
               </span>
            </div>

            <div className="flex items-center justify-between text-sm">
               <div className="flex items-center gap-2 text-neutral/60">
                  <RiTruckLine className="text-primary" />
                  <span>Shipping</span>
               </div>
               <span className="text-sm italic text-neutral/60">Free</span>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-base-300">
               <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-neutral">Total</span>
                  <div className="text-right">
                     <span className="text-lg font-bold text-primary">
                        {formatPrice(totalAmount)}
                     </span>
                     <p className="text-xs text-neutral/60 mt-0.5">
                        Including taxes & shipping
                     </p>
                  </div>
               </div>
            </div>
         </motion.div>

         {/* Additional Info */}
         <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm"
         >
            <div className="flex items-center gap-2">
               <RiShieldCheckLine className="flex-shrink-0 text-lg" />
               <p>Secure checkout with encrypted payment processing</p>
            </div>
         </motion.div>
      </motion.div>
   );
};

export default CheckoutSummary;
