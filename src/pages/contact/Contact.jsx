import React, { useRef, useState } from "react";
import { CiPhone } from "react-icons/ci";
import { AiOutlineMail, AiOutlineTwitter } from "react-icons/ai";
import { RiSendPlaneFill, RiUserLine, RiMailLine, RiFileCopyLine } from "react-icons/ri";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { toastConfig } from "../../utils/toastConfig";

const Contact = () => {
   const formRef = useRef();
   const [loading, setLoading] = useState(false);
   const [formValues, setFormValues] = useState({
      username: "",
      email: "",
      subject: "",
      message: ""
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({
         ...formValues,
         [name]: value
      });
   };

   const sendEmail = (e) => {
      e.preventDefault();
      setLoading(true);
      emailjs
         .sendForm(
            "service_rn5uwdh",
            "template_z55djla",
            formRef.current,
            "onCf_FZuuuG_27Kb_"
         )
         .then(
            (result) => {
               console.log(result.text);
               toast.success("Message sent successfully. We'll contact you shortly.", toastConfig.success);
               setFormValues({
                  username: "",
                  email: "",
                  subject: "",
                  message: ""
               });
            },
            (error) => {
               console.log(error.text);
               toast.error("Something went wrong. Please try again later.", toastConfig.error);
            }
         )
         .finally(() => {
            setLoading(false);
         });
   };

   // Animation variants
   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            when: "beforeChildren",
            staggerChildren: 0.2
         }
      }
   };

   const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
         y: 0,
         opacity: 1,
         transition: { type: "spring", stiffness: 300, damping: 24 }
      }
   };

   const contactMethods = [
      {
         icon: <AiOutlineMail className="text-2xl" />,
         text: "Support@eshop.com",
         link: "mailto:Support@eshop.com?subject=Feedback&body=message"
      },
      {
         icon: <CiPhone className="text-2xl" />,
         text: "123-456-789",
         link: "tel:+1234567890"
      },
      {
         icon: <AiOutlineTwitter className="text-2xl" />,
         text: "@psaj",
         link: "https://twitter.com/"
      }
   ];

   return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-36 pb-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title with animated underline */}
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="mb-16 text-center"
            >
               <h1 className="text-4xl md:text-5xl font-serif font-medium text-neutral relative inline-block">
                  Contact Us
                  <motion.span 
                     initial={{ width: 0 }}
                     animate={{ width: "100%" }}
                     transition={{ delay: 0.5, duration: 0.8 }}
                     className="absolute bottom-0 left-0 h-0.5 bg-primary/30"
                  />
               </h1>
               <p className="mt-4 text-neutral/60 max-w-2xl mx-auto text-lg">
                  We'd love to hear from you. Please fill out the form below or reach out using our contact information.
               </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-10 xl:gap-20">
               {/* Contact Information Card */}
               <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full lg:w-[38%] order-2 lg:order-1"
               >
                  <div className="bg-white shadow-xl overflow-hidden h-full border border-gray-100">
                     <div className="relative h-full">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtb3BhY2l0eT0iMC40IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQxLTguMDU5LTE4LTE4LTE4UzAgOC4wNTkgMCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOHoiLz48cGF0aCBkPSJNNTQgMThjMC05Ljk0MS04LjA1OS0xOC0xOC0xOFMxOCA4LjA1OSAxOCAxOHM4LjA1OSAxOCAxOCAxOCA1NC04LjA1OSA1NC0xOHoiLz48L2c+PC9zdmc+')]" />
                        </div>

                        <div className="relative h-full z-10 p-8 md:p-10 flex flex-col">
                           {/* Contact Card Header */}
                           <motion.div variants={itemVariants} className="mb-10">
                              <h2 className="text-2xl md:text-3xl font-medium text-neutral mb-3">
                                 Contact Information
                              </h2>
                              <p className="text-neutral/60">
                                 Fill the form or contact us via other channels
                              </p>
                           </motion.div>

                           {/* Contact Methods */}
                           <div className="space-y-6 mt-auto">
                              {contactMethods.map((method, index) => (
                                 <motion.a
                                    key={index}
                                    href={method.link}
                                    target={method.link.startsWith('http') ? "_blank" : ""}
                                    rel="noreferrer"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-4 text-neutral/80 hover:text-primary transition-colors duration-300"
                                 >
                                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
                                       {method.icon}
                                    </div>
                                    <span className="text-lg">{method.text}</span>
                                 </motion.a>
                              ))}
                           </div>

                           {/* Decorative element */}
                           <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2, duration: 1 }}
                              className="absolute bottom-0 right-0 w-40 h-40 bg-primary/5 -mb-20 -mr-20"
                           />
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Contact Form */}
               <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full lg:w-[62%] order-1 lg:order-2"
               >
                  <div className="bg-white shadow-xl p-8 md:p-10 border border-gray-100">
                     <motion.h2 
                        variants={itemVariants}
                        className="text-2xl md:text-3xl font-medium text-neutral mb-8"
                     >
                        Send Us a Message
                     </motion.h2>

                     <form 
                        ref={formRef}
                        onSubmit={sendEmail}
                        className="space-y-6"
                     >
                        {/* Name field */}
                        <motion.div variants={itemVariants}>
                           <label className="block text-sm font-medium text-neutral/80 mb-2">
                              Full Name
                           </label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral/50">
                                 <RiUserLine />
                              </div>
                              <input
                                 type="text"
                                 name="username"
                                 value={formValues.username}
                                 onChange={handleChange}
                                 placeholder="John Doe"
                                 required
                                 className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary transition duration-200 placeholder:text-neutral/40"
                              />
                           </div>
                        </motion.div>

                        {/* Email field */}
                        <motion.div variants={itemVariants}>
                           <label className="block text-sm font-medium text-neutral/80 mb-2">
                              Email Address
                           </label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral/50">
                                 <RiMailLine />
                              </div>
                              <input
                                 type="email"
                                 name="email"
                                 value={formValues.email}
                                 onChange={handleChange}
                                 placeholder="your.email@example.com"
                                 required
                                 className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary transition duration-200 placeholder:text-neutral/40"
                              />
                           </div>
                        </motion.div>

                        {/* Subject field */}
                        <motion.div variants={itemVariants}>
                           <label className="block text-sm font-medium text-neutral/80 mb-2">
                              Subject
                           </label>
                           <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral/50">
                                 <RiFileCopyLine />
                              </div>
                              <input
                                 type="text"
                                 name="subject"
                                 value={formValues.subject}
                                 onChange={handleChange}
                                 placeholder="How can we help you?"
                                 required
                                 className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary transition duration-200 placeholder:text-neutral/40"
                              />
                           </div>
                        </motion.div>

                        {/* Message field */}
                        <motion.div variants={itemVariants}>
                           <label className="block text-sm font-medium text-neutral/80 mb-2">
                              Message
                           </label>
                           <textarea
                              name="message"
                              value={formValues.message}
                              onChange={handleChange}
                              rows={5}
                              placeholder="Tell us about your inquiry..."
                              required
                              className="block w-full p-4 border-2 border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary transition duration-200 placeholder:text-neutral/40 resize-none"
                           />
                        </motion.div>

                        {/* Submit button */}
                        <motion.div 
                           variants={itemVariants}
                           className="pt-4"
                        >
                           <motion.button
                              type="submit"
                              disabled={loading}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary-focus transition-all duration-300 ${
                                 loading ? "opacity-80" : "hover:shadow-xl hover:shadow-primary/30"
                              }`}
                           >
                              {loading ? (
                                 <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin" />
                              ) : (
                                 <RiSendPlaneFill size={18} />
                              )}
                              <span>{loading ? "Sending..." : "Send Message"}</span>
                           </motion.button>
                        </motion.div>
                     </form>
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
   );
};

export default Contact;
