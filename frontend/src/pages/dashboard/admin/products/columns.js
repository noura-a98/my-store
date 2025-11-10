import { createColumnHelper } from "@tanstack/react-table";
require('./AdminProducts.css')

const columnHelper = createColumnHelper();

export const columns = ({ onEdit, onDelete }) => [
  columnHelper.display({
    id: "rowNumber",
    header: "#",
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Product Name",
  }),
  columnHelper.accessor("description", {
    id: "description",
    header: "Description",
    cell: (info) => (
      <div style={{ maxWidth: "300px", wordBreak: "break-word" }}>
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("price", {
    id: "price",
    header: "Price (AED)",
    cell: (info) => `${info.getValue()} AED`,
  }),
  columnHelper.accessor("stock", {
    id: "stock",
    header: "Stock",
  }),
  columnHelper.accessor("imageCover", {
    id: "imageCover",
    header: "Image",
    cell: (info) => {
      const imageFileName = info.getValue();
      console.log("Image file name:", imageFileName); // Debug log
      
      if (!imageFileName) return <span style={{ color: "#999" }}>No Image</span>;

      // Check if imageFileName already includes the full path
      let imageUrl;
      if (imageFileName.startsWith('http')) {
        // If it's already a full URL, use it as is
        imageUrl = imageFileName;
      } else if (imageFileName.includes('/')) {
        // If it includes path separators, it might be a relative path
        imageUrl = `http://localhost:8000/${imageFileName}`;
      } else {
        // If it's just a filename, construct the full path
        imageUrl = `http://localhost:8000/img/products/${imageFileName}`;
      }

      console.log("Constructed image URL:", imageUrl); // Debug log

      return (
        <img
          src={imageUrl}
          alt="Product"
          style={{
            width: 60,
            height: 60,
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
          onError={(e) => {
            console.error("Image failed to load:", imageUrl); // Debug log
            console.error("Error details:", e); // More debug info
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/60x60?text=No+Image";
          }}
          onLoad={() => {
            console.log("Image loaded successfully:", imageUrl); // Debug log
          }}
          crossOrigin="anonymous"
        />
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          className="action-button edit"
          onClick={() => onEdit(row.original)}
          type="button"
        >
          Edit
        </button>
        <button
          className="action-button delete"
          onClick={() => onDelete(row.original._id)}
          type="button"
        >
          Delete
        </button>
      </div>
    ),
  }),
];