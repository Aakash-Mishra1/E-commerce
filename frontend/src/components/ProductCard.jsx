import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl shadow-lg p-4 hover:scale-105 transition duration-300">
      <img src={product.image || "https://via.placeholder.com/300"} className="rounded-xl mb-3 w-full h-48 object-cover" alt={product.title} />

      <h2 className="font-poppins text-xl text-gray-100 mb-1">{product.title}</h2>
      <p className="text-cyber-blue text-lg font-semibold mb-3">₹{product.price}</p>

      <Link
        to={`/product/${product._id}`}
        className="block bg-cyber-blue text-white text-center py-2 rounded-xl hover:bg-cyber-blueLight transition shadow-lg shadow-cyber-blue/20"
      >
        View Details
      </Link>
    </div>
  );
}