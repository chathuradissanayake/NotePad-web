import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes, onEdit, onDelete, onCreate }) => {
  if (!notes.length) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div>
        <button onClick={onCreate} className="w-full h-full bg-blue-500 text-white p-6 rounded shadow">
          + New Note
        </button>
      </div>
      <p className="col-span-full">No notes yet</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div>
        <button onClick={onCreate} className="w-full h-full bg-blue-500 text-white p-6 rounded shadow">
          + New Note
        </button>
      </div>
      {notes.map((note) => (
        <NoteItem key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NoteList;