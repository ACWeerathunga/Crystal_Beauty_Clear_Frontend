import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import toast from "react-hot-toast";
import { Loader } from "../../components/loader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
        .then((response) => {
          setProducts(response.data);
          setLoaded(true);
        });
    }
  }, [loaded]);

  async function deleteProduct(id) {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("Please login to delete a product");
      return;
    }
    try {
      await axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/product/" + id, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setLoaded(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting product");
      return;
    }
  }

  return (
    <div className="w-full h-full rounded-lg relative">
      <Link
        to={"/admin/addProduct"}
        className="text-white absolute bg-gray-700 p-[12px] text-3xl rounded-full cursor-pointer hover:bg-gray-300 hover:text-gray-700 right-5 bottom-5"
      >
        <FaPlus />
      </Link>

      {loaded && (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Labeled Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              return (
                <tr
                  key={index}
                  className="border-t border-gray-300 text-center cursor-pointer hover:bg-gray-100"
                >
                  <td className="p-2">{product.productId}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">${product.price.toFixed(2)}</td>
                  <td className="p-2">${product.labeledPrice.toFixed(2)}</td>
                  <td className="p-2">{product.stock}</td>
                  <td className="p-2">
                    <div className="w-full h-full flex justify-center">
                      <FaRegTrashAlt
                        onClick={() => {
                          deleteProduct(product.productId);
                        }}
                        className="text-[25px] m-[10px] hover:text-red-600"
                      />
                      <GrEdit className="text-[25px] m-[10px] hover:text-blue-500" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!loaded && 
      <Loader />}
       
      
    </div>
  );
}
