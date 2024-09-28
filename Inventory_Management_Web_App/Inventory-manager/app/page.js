"use client";
import Header from "@/app/components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let res = await response.json();
      setProducts(res.products);
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action === "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }

    if (newProducts[index].quantity === 0) {
      newProducts = newProducts.filter((item) => item.slug !== slug);
    }

    setProducts(newProducts);

    let indexDrop = dropdown.findIndex((item) => item.slug == slug);
    let newProductsDrop = JSON.parse(JSON.stringify(dropdown));
    if (action === "plus") {
      newProductsDrop[indexDrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProductsDrop[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }

    if (newProductsDrop[indexDrop].quantity === 0) {
      newProductsDrop = newProductsDrop.filter((item) => item.slug !== slug);
    }

    setDropdown(newProductsDrop);

    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    });
    await response.json();
    setLoadingAction(false);
  };


  const addProduct = async () => {
    if (
      productForm.quantity === "" ||
      productForm.quantity == null ||
      productForm.price === "" ||
      productForm.price == null ||
      productForm.slug === "" ||
      productForm.slug == null
    ) {
      alert("Please Enter All Details!");
      return;
    } else if (productForm.quantity <= 0 || productForm.price <= 0) {
      alert("Quantity or Price is not valid input!");
      return;
    } else {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setProductForm({});
        window.location.reload()
      } else {
        alert("Failed to add product");
      }
    }
  };


  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const fetchDropdownProducts = async (newQueryInp) => {
    setLoading(true);
    setDropdown([]);
    try {
      const responseDrop = await fetch("/api/search?query=" + newQueryInp);
      let resDrop = await responseDrop.json();
      setDropdown(resDrop.products);
    } catch (error) {
      console.error("Error fetching dropdown products:", error);
    }
    setLoading(false);
  };

  const onDropdownEdit = (value) => {
    const newQueryInp = value
    setQuery(newQueryInp);

    if (timeoutId) {
      clearTimeout(timeoutId); // Clear the previous timeout
    }

    if (newQueryInp === "") {
      setDropdown([]);
    } else {
      const newTimeoutId = setTimeout(() => {
        fetchDropdownProducts(newQueryInp);
      }, 300); // Set a new timeout

      setTimeoutId(newTimeoutId); // Update the timeout ID
    }
  };


  return (
    <>
      <Header />
      <div className="container mx-auto p-4 my-2 bg-gray-200 rounded w-[98%]">
        <h1 className="text-2xl font-bold text-center text-black mb-4">Search a Product</h1>
        <div className="bg-white p-4 rounded shadow-md mb-8">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="searchProduct">
              Product Name
            </label>

            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="searchProduct"
              name="searchProduct"
              type="text"
              placeholder="Search Product"
              value={query}
              onChange={(e) => onDropdownEdit(e.target.value)}
            />
          </div>
          {loading && (
            <div className="flex">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="4"
                  strokeDasharray="31.415, 31.415"
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="xml"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          )}
          <div className="dropContainer bg-gray-400 w-[100%]">
            {dropdown.map((item) => (
              <div key={item.slug} className="container mx-auto flex justify-between items-center p-2 border-b-2 border-gray-600 flex-wrap font-bold">
                <div className="slug flex items-center gap-[2px]">
                  <div className="inline-block w-[20vw] overflow-x-auto">{item.slug}</div> ({item.quantity} items available for Rs {item.price} each)
                </div>
                <div className="bg-white p-[4px] flex justify-center items-center gap[2px]">
                  <button
                    disabled={loadingAction}
                    onClick={() => {
                      buttonAction("plus", item.slug, item.quantity);
                    }}
                    className="disabled:bg-gray-400 flex justify-center item-center add  bg-gray-600 hover:bg-gray-700 text-white rounded-md m-[2px] w-[20px] cursor-pointer"
                  >
                    +
                  </button>
                  <span className="quantity w-[60px] flex justify-center items-center">{item.quantity}</span>
                  <button
                    disabled={loadingAction}
                    onClick={() => {
                      buttonAction("minus", item.slug, item.quantity);
                    }}
                    className="disabled:bg-gray-400 flex justify-center items-center subtract bg-gray-600 hover:bg-gray-700 text-white rounded-md m-[2px] w-[20px] cursor-pointer"
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto w-[98%] p-4 my-2 bg-gray-200 rounded">
        <h1 className="text-2xl font-bold text-center text-black mb-4">Add a Product</h1>
        <form className="bg-white p-4 rounded shadow-md mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
              Product Slug
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="slug"
              id="productName"
              onChange={handleChange}
              type="text"
              placeholder="Enter Product Name"
              value={productForm.slug || ""}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="quantity"
              id="quantity"
              onChange={handleChange}
              type="number"
              placeholder="Enter Quantity"
              value={productForm.quantity || ""}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="price"
              id="price"
              onChange={handleChange}
              type="text"
              placeholder="Enter Price"
              value={productForm.price || ""}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={addProduct}
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
      <div className="container mx-auto w-[98%] p-4 my-2 bg-gray-200 rounded">
        <h1 className="text-2xl font-bold text-center text-black mb-4">Display Current Stock</h1>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border">
            <thead className="bg-gray-400 text-black">
              <tr>
                <th className="py-2 px-4 border-b text-md">Product Name</th>
                <th className="py-2 px-4 border-b text-md">Quantity</th>
                <th className="py-2 px-4 border-b text-md">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.slug}>
                  <td className="py-2 px-4 border-b text-center">{product.slug}</td>
                  <td className="py-2 px-4 border-b text-center">{product.quantity}</td>
                  <td className="py-2 px-4 border-b text-center">{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}
