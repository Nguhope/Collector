/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center gap-3 mt-6"
    >
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`p-2 rounded-full shadow transition ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90"
        }`}
      >
        <FaChevronLeft size={14} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              page === currentPage
                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {page}
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full shadow transition ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90"
        }`}
      >
        <FaChevronRight size={14} />
      </button>
    </motion.div>
  );
};

export default Pagination;
