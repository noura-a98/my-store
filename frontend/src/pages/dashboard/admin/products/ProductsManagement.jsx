import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductFormModal from "../../../../components/modals/ProductFormModal";
import { DataTable } from "../../../../components/ui/data-table";
import { Button } from "../../../../components/ui/button";
import { columns as productColumns } from "./columns";
import "./AdminProducts.css";

function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Products fetched:", res.data.data);
        
        // Debug: Log each product's imageCover field
        res.data.data.forEach((product, index) => {
          console.log(`Product ${index + 1} imageCover:`, product.imageCover);
        });
        
        setProducts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [token]);

  const addProduct = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/products/create-product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("New product added:", res.data.data); // Debug log
      setProducts((prev) => [...prev, res.data.data]);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const updateProduct = async (formData) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/products/${formData.get("_id")}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product updated:", res.data.data); // Debug log
      setProducts((prev) =>
        prev.map((p) => (p._id === res.data.data._id ? res.data.data : p))
      );
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="products-management page-container">
      <div className="flex-between mb-4">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="action-button add"
        >
          + Add Product
        </Button>
      </div>

      <DataTable
        columns={productColumns({
          onEdit: (product) => {
            setEditingProduct(product);
            setShowModal(true);
          },
          onDelete: deleteProduct,
        })}
        data={products}
      />

      <ProductFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
        onSave={async (formData) => {
          if (editingProduct) {
            await updateProduct(formData);
          } else {
            await addProduct(formData);
          }
          setShowModal(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
}

export default ProductsManagement;