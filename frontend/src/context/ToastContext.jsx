import React, { createContext, useContext, useState, useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";
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

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
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
    success: <FiCheckCircle className="w-5 h-5 text-green-400" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-400" />,
    info: <FiInfo className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: "bg-gray-900 border-green-500/20",
    error: "bg-gray-900 border-red-500/20",
    info: "bg-gray-900 border-blue-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md min-w-[300px] ${bgColors[toast.type] || bgColors.info}`}
    >
      {icons[toast.type]}
      <p className="text-gray-200 text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
        <FiX className="w-4 h-4 text-gray-500" />
      </button>
    </motion.div>
  );
};
