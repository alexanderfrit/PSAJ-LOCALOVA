import React from "react";
import { motion } from "framer-motion";
import StarRating from "react-star-rate";
import { RiUserLine, RiCalendarLine, RiTimeLine, RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

const ReviewComponent = ({ review }) => {
   // Animation variants
   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: { 
            duration: 0.6,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.1
         }
      }
   };

   const itemVariants = {
      hidden: { y: 10, opacity: 0 },
      visible: { 
         y: 0, 
         opacity: 1,
         transition: { duration: 0.4, ease: "easeOut" }
      }
   };

   // Get first letter of username for avatar fallback
   const userInitial = review.userName ? review.userName.charAt(0).toUpperCase() : "U";

   return (
      <motion.div 
         variants={containerVariants}
         initial="hidden"
         animate="visible"
         className="w-full"
      >
         <div className="flex flex-col md:flex-row gap-8">
            {/* User Info Section */}
            <motion.div variants={itemVariants} className="w-full md:w-64 flex-shrink-0">
               <div className="flex items-center gap-4">
                  {/* User Avatar - Show Google profile pic if available */}
                  {review.userPhoto ? (
                     <img 
                        src={review.userPhoto} 
                        alt={review.userName}
                        className="w-12 h-12 object-cover border border-primary/30"
                        referrerPolicy="no-referrer"
                     />
                  ) : (
                     <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <span className="text-primary text-lg font-serif">{userInitial}</span>
                     </div>
                  )}
                  
                  {/* User Details */}
                  <div>
                     <h3 className="font-medium text-neutral">{review.userName}</h3>
                     <div className="flex items-center text-neutral/60 text-sm mt-1">
                        <RiUserLine className="mr-1" />
                        <span>Verified Customer</span>
                     </div>
                  </div>
               </div>
               
               {/* Rating Section */}
               <div className="mt-5">
                  <div className="flex items-center">
                     <StarRating className="text-yellow-400" value={review.rating} disabled={true} />
                     <span className="ml-2 text-primary font-medium">{review.rating}.0</span>
                  </div>
                  <div className="flex items-center text-neutral/60 text-sm mt-4 space-x-4">
                     <div className="flex items-center">
                        <RiCalendarLine className="mr-1" />
                        <span>{review.reviewDate}</span>
                     </div>
                     <div className="flex items-center">
                        <RiTimeLine className="mr-1" />
                        <span>{review.reviewTime}</span>
                     </div>
                  </div>
               </div>
            </motion.div>
            
            {/* Review Content Section */}
            <motion.div variants={itemVariants} className="flex-1">
               <div className="relative bg-base-200/30 border border-base-300 p-10">
                  {/* Decorative quote marks */}
                  <RiDoubleQuotesL className="absolute top-3 left-3 text-primary/10 text-2xl" />
                  <RiDoubleQuotesR className="absolute bottom-3 right-3 text-primary/10 text-2xl" />
                  
                  {/* Review content with proper padding to avoid overlap */}
                  <div className="prose prose-neutral max-w-none">
                     <p className="text-neutral/80 leading-relaxed">{review.review}</p>
                  </div>
               </div>
               
               {/* Optional Badge for Premium Members */}
               {review.premiumReview && (
                  <div className="mt-3 bg-primary/5 border border-primary/20 px-3 py-1.5 inline-flex items-center">
                     <span className="text-primary text-sm font-medium">Premium Review</span>
                  </div>
               )}
            </motion.div>
         </div>
      </motion.div>
   );
};

export default ReviewComponent;
