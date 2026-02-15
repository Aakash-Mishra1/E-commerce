import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/product/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl font-poppins font-bold text-cyber-blue mb-8">Latest Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </>
  );
}