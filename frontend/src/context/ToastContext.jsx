import React, { createContext, useContext, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiShoppingBag } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    cart: (msg) => addToast(msg, 'cart')
  };

  return (
    <ToastContext.Provider value={{ addToast, toast }}>
      {children}
      <div className="fixed top-24 right-6 z-[5000] flex flex-col-reverse gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-green-300" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-300" />,
    info: <FiInfo className="w-5 h-5 text-blue-300" />,
    cart: <FiShoppingBag className="w-5 h-5 text-yellow-300" />
  };

  const bgColors = {
    // Google-style dark mode snackbar: Dark grey/black background, slight elevation
    success: "bg-[#323232] text-white",
    error: "bg-[#323232] text-white",
    info: "bg-[#323232] text-white",
    cart: "bg-[#323232] text-white"
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        layout
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[4px] shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_6px_10px_0_rgba(0,0,0,0.14),0_1px_18px_0_rgba(0,0,0,0.12)] min-w-[288px] max-w-[568px] ${bgColors[toast.type]}`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="text-[14px] font-medium tracking-wide flex-1 font-roboto">{toast.message}</p>
      <button 
        onClick={onClose} 
        className="ml-4 text-purple-300 text-sm font-bold uppercase hover:bg-white/10 px-2 py-1 rounded transition-colors"
      >
        Dismiss
      </button>
    </motion.div>
  );
};
