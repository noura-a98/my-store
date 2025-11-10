import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "../../../../../components/ui/button";

const columnHelper = createColumnHelper();

export const columns = ({ onEdit, onDelete }) => [
  columnHelper.display({
  id: "rowNumber",
  header: "#",
  cell: (info) => info.row.index + 1,
}),

  columnHelper.accessor("userName", { header: "User Name" }),
  columnHelper.accessor("firstName", { header: "First Name" }),
  columnHelper.accessor("lastName", { header: "Last Name" }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("phone", { header: "Phone" }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => (
      <span className={`px-2 py-1 rounded ${info.getValue() === "admin" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
        {info.getValue()}
      </span>
    ),
  }),
  
  columnHelper.display({
    
    id: "actions",
    header: "Actions",
        cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="action-button edit" onClick={() => onEdit(row.original)}>
              Edit
            </button>
            <button className="action-button delete" onClick={() => onDelete(row.original._id)}>
              Delete
            </button>
          </div>
        ),


  }),
];