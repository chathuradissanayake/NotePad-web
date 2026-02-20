import React from "react";
import AdminNoteItem from "./AdminNoteItem";

const AdminNoteList = ({ notes = [], onEdit, onDelete }) => {
  if (!notes.length) {
    return (
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg md:text-xl">No notes found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
      {notes.map((note) => (
        <AdminNoteItem key={note._id || note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default AdminNoteList;