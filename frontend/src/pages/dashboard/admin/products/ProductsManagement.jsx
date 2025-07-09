import React, { useState } from 'react';
import './AdminProducts.css';
import ProductFormModal from '../../../../components/modals/ProductFormModal';

const dummyProducts = [
  {
    _id: '1',
    name: 'Sweet Drops – Sugar-Free',
    description: 'Delicious and sugar-free sweetener',
    price: 49.99,
    stock: 100,
    imageCover: 'sweet.jpg'
  },
  {
    _id: '2',
    name: 'Vanilla Flavor',
    description: 'Sugar-free vanilla essence',
    price: 29.99,
    stock: 50,
    imageCover: 'vanilla.jpg'
  }
];

function ProductsManagement() {
  const [products, setProducts] = useState(dummyProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <div className="products-management">
      <div className="header">
        <h2>Product Management</h2>
        <button className="add-product" onClick={() => {
          setEditingProduct(null);
          setShowModal(true);
        }}>+ Add Product</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price (AED)</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td><img src={`/uploads/${p.imageCover}`} alt={p.name} width="50" /></td>
              <td>
                <button className="edit-btn" onClick={() => {
                  setEditingProduct(p);
                  setShowModal(true);
                }}>Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingProduct={editingProduct}
        onSave={(productData) => {
          if (editingProduct) {
            setProducts(prev => prev.map(p => p._id === productData._id ? productData : p));
          } else {
            setProducts(prev => [...prev, { ...productData, _id: Date.now().toString() }]);
          }
        }}
      />
    </div>
  );
}

export default ProductsManagement;
