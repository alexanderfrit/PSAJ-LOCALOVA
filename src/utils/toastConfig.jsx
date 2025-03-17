import React from "react";
import { RiCheckLine, RiErrorWarningLine, RiInformationLine, RiCloseLine } from "react-icons/ri";

export const toastConfig = {
  success: {
    style: {
      background: "#0B4D3C",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "16px 24px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      borderLeft: "4px solid #059669"
    },
    icon: <RiCheckLine className="w-6 h-6 text-emerald-300" />,
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeButton: <div className="p-1 hover:bg-white/10 rounded-full transition-colors">
      <RiCloseLine className="w-5 h-5 text-current" />
    </div>,
    bodyClassName: "flex items-center gap-3",
    className: "!font-sans !max-w-md !bg-opacity-90 backdrop-blur-sm"
  },
  error: {
    style: {
      background: "#7B1818",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "16px 24px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      borderLeft: "4px solid #DC2626"
    },
    icon: <RiErrorWarningLine className="w-6 h-6 text-red-300" />,
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: "!font-sans",
  },
  info: {
    style: {
      background: "#1E3A8A",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "16px 24px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      borderLeft: "4px solid #2563EB"
    },
    icon: <RiInformationLine className="w-6 h-6 text-blue-300" />,
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: "!font-sans",
  }
}; 