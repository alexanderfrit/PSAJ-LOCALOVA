import React from "react";
import { FaBox, FaShippingFast } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";

const Steps = ({ order }) => {
  const steps = [
    { 
      status: "orderPlaced", 
      icon: FaBox,
      description: "Your order has been placed",
      label: "Order Placed"
    },
    { 
      status: "Processing...", 
      icon: MdOutlineLocalShipping,
      description: "Your order is being processed",
      label: "Processing"
    },
    { 
      status: "Item(s) Shipped", 
      icon: FaShippingFast,
      description: "Your order is on the way",
      label: "Shipped"
    },
    { 
      status: "Item(s) Delivered", 
      icon: BsCheckCircleFill,
      description: "Your order has been delivered",
      label: "Delivered"
    }
  ];

  // Fix for status matching - handles both "orderPlaced" and "Order Placed"
  const getCurrentStep = () => {
    // Direct match
    const directIndex = steps.findIndex(step => step.status === order.orderStatus);
    if (directIndex !== -1) return directIndex;
    
    // Check for "Order Placed" special case
    if (order.orderStatus === "Order Placed") return 0;
    
    // Handle other possible mismatches
    if (order.orderStatus === "Processing") return 1;
    if (order.orderStatus === "Shipped") return 2;
    
    // Default to first step if no match found
    return 0;
  };
  
  const currentStep = getCurrentStep();

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= currentStep;
        const isCurrent = index === currentStep;

        return (
          <div 
            key={index}
            className={`flex items-start p-4 border ${
              isCompleted 
                ? 'border-primary/30 bg-primary/5' 
                : 'border-base-300 bg-base-100'
            }`}
          >
            <div 
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4 ${
                isCompleted 
                  ? 'bg-primary text-white' 
                  : 'bg-base-200 text-neutral/40'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${isCompleted ? 'text-primary' : 'text-neutral/60'}`}>
                  {step.label}
                </h3>
                {isCurrent && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1">
                    Current
                  </span>
                )}
              </div>
              <p className={`text-sm mt-1 ${isCompleted ? 'text-neutral/70' : 'text-neutral/40'}`}>
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Steps;
