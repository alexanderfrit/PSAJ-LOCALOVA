import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { OrderTable, Steps } from "../../components";
import { RiUser3Line, RiPhoneLine, RiMapPin2Line, RiCalendarLine, RiMoneyDollarCircleLine, RiArrowLeftSLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { motion } from "framer-motion";
import ChangeOrderStatus from "../changeOrderStatus/ChangeOrderStatus";

const OrderDetailsComponent = ({ order, admin, user, orderId }) => {
   return (
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="min-h-screen bg-base-200/50 py-8 pt-32"
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Back Button */}
            <Link 
               to={admin ? "/admin/orders" : "/my-orders"} 
               className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-neutral hover:text-primary transition-colors group"
            >
               <RiArrowLeftSLine className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
               Back to {admin ? "All Orders" : "My Orders"}
            </Link>

            {/* Order Details Card */}
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="mt-6 bg-white border border-base-300"
            >
               <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-base-300">
                     <h1 className="text-2xl font-serif text-neutral">
                        Order Details
                     </h1>
                     <div className="flex items-center gap-2 text-sm text-neutral/60">
                        <RiCalendarLine className="text-primary" />
                        <span>Order Date: {order.orderDate}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Left Column - Order Info */}
                     <div className="space-y-8">
                        {/* Order Summary Card */}
                        <motion.div 
                           initial={{ y: 20, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: 0.1 }}
                           className="bg-base-200/50 p-6"
                        >
                           <h2 className="text-lg font-medium text-neutral mb-4">
                              Order Summary
                           </h2>
                           <div className="space-y-4">
                              <div className="flex items-center gap-3 text-neutral/80">
                                 <TbTruckDelivery className="text-primary w-5 h-5" />
                                 <span className="font-medium">Order ID:</span>
                                 <span className="font-mono">{order.id}</span>
                              </div>

                              <div className="flex items-center gap-3 text-neutral/80">
                                 <RiMoneyDollarCircleLine className="text-primary w-5 h-5" />
                                 <span className="font-medium">Total Amount:</span>
                                 <span className="text-primary font-medium">{formatPrice(order.orderAmount)}</span>
                              </div>

                              <div className="flex items-center gap-3 text-neutral/80">
                                 <TbTruckDelivery className="text-primary w-5 h-5" />
                                 <span className="font-medium">Status:</span>
                                 <span className={`px-3 py-1 text-sm font-medium ${
                                    order.orderStatus === "Item(s) Delivered"
                                       ? "bg-green-100 text-green-800"
                                       : "bg-blue-100 text-blue-800"
                                 }`}>
                                    {order.orderStatus}
                                 </span>
                              </div>
                           </div>
                        </motion.div>

                        {/* Shipping Info - Only for Admin */}
                        {admin && (
                           <motion.div 
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="bg-base-200/50 p-6"
                           >
                              <h2 className="text-lg font-medium text-neutral mb-4">
                                 Shipping Information
                              </h2>
                              <div className="space-y-4">
                                 <div className="flex items-center gap-3 text-neutral/80">
                                    <RiUser3Line className="text-primary w-5 h-5" />
                                    <span className="font-medium">Recipient:</span>
                                    <span>{order.shippingAddress.name}</span>
                                 </div>

                                 <div className="flex items-center gap-3 text-neutral/80">
                                    <RiPhoneLine className="text-primary w-5 h-5" />
                                    <span className="font-medium">Phone:</span>
                                    <span>{order.shippingAddress.phone}</span>
                                 </div>

                                 <div className="flex items-start gap-3 text-neutral/80">
                                    <RiMapPin2Line className="text-primary w-5 h-5 mt-1" />
                                    <div>
                                       <span className="font-medium">Address:</span>
                                       <address className="mt-1 not-italic">
                                          {order.shippingAddress.line1}<br />
                                          {order.shippingAddress.line2 && (
                                             <>{order.shippingAddress.line2}<br /></>
                                          )}
                                          {order.shippingAddress.city}<br />
                                          {order.shippingAddress.country}
                                       </address>
                                    </div>
                                 </div>
                              </div>
                           </motion.div>
                        )}
                     </div>

                     {/* Right Column - Status/Steps */}
                     <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                     >
                        {user && (
                           <div className="bg-base-200/50 p-6">
                              <h2 className="text-lg font-medium text-neutral mb-4">
                                 Order Progress
                              </h2>
                              <Steps order={order} />
                           </div>
                        )}
                        {admin && (
                           <div className="bg-base-200/50 p-6">
                              <h2 className="text-lg font-medium text-neutral mb-4">
                                 Update Order Status
                              </h2>
                              <ChangeOrderStatus order={order} orderId={orderId} />
                           </div>
                        )}
                     </motion.div>
                  </div>
               </div>
            </motion.div>

            {/* Order Items Table */}
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="mt-8 bg-white border border-base-300"
            >
               <div className="p-6 sm:p-8">
                  <OrderTable order={order} user={user} />
               </div>
            </motion.div>
         </div>
      </motion.div>
   );
};

export default OrderDetailsComponent;
