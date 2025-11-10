import React, { useState, useEffect } from 'react';

function ProductFormModal({ isOpen, onClose, editingProduct, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [imageCover, setImageCover] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        stock: editingProduct.stock || ''
      });
      setImageCover(null);
      setImages([]);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
      setImageCover(null);
      setImages([]);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e) => {
    setImageCover(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      alert('You can upload a maximum of 3 images.');
    } else {
      setImages(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = new FormData();
    formToSend.append('name', formData.name);
    formToSend.append('description', formData.description);
    formToSend.append('price', formData.price);
    formToSend.append('stock', formData.stock);
    if (imageCover) formToSend.append('imageCover', imageCover);
    images.forEach((img, index) => formToSend.append('images', img));
    if (editingProduct) formToSend.append('_id', editingProduct._id);

    await onSave(formToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          <label>Cover Image:</label>
          <input
            type="file"
            name="imageCover"
            accept="image/*"
            onChange={handleCoverImageChange}
          />

          <label>Additional Images (Max 3):</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
