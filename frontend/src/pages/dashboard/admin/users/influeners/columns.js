import React from 'react';

export const columns = ({ onEdit, onDelete }) => [
  { 
    header: '#', 
    accessorKey: 'index', 
    cell: info => info.row.index + 1 
  },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Code', accessorKey: 'code' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Phone', accessorKey: 'phone' },
  { header: 'Instagram', accessorKey: 'instagram' },
  { header: 'TikTok', accessorKey: 'tiktok' },
  { header: 'Count', accessorKey: 'count' },
  
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const influencer = row.original;
      return (
        <div>
          <button
            className="action-button edit"
            onClick={() => onEdit(influencer)}
          >
            Edit
          </button>
          <button
            className="action-button delete"
            onClick={() => onDelete(influencer._id)}
            style={{ marginLeft: '8px' }}
          >
            Delete
          </button>
        </div>
      );
    },
  },
];
