import React from 'react';

const NoteItem = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow flex flex-col justify-between h-full">
      <div>
        <h3 className="font-bold text-lg mb-2">{note.subject}</h3>
        <p className="mb-4">{note.body}</p>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(note)}
            className="bg-yellow-400 px-2 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
