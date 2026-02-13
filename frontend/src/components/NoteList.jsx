import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes, onEdit, onDelete, onCreate }) => {
  if (!notes.length) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      <div 
        onClick={onCreate}
        className="group cursor-pointer bg-linear-to-br from-cyan-100 to-teal-100 hover:from-cyan-200 hover:to-teal-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-h-62.5 flex flex-col items-center justify-center border-2 border-dashed border-cyan-400"
      >
        <svg className="w-16 h-16 text-cyan-600 mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <p className="text-cyan-600 font-semibold text-lg">New Note</p>
      </div>
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500 text-xl">No notes yet. Create your first note!</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      <div 
        onClick={onCreate}
        className="group cursor-pointer bg-linear-to-br from-cyan-100 to-teal-100 hover:from-cyan-200 hover:to-teal-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-h-62.5 flex flex-col items-center justify-center border-2 border-dashed border-cyan-400"
      >
        <svg className="w-16 h-16 text-cyan-600 mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <p className="text-cyan-600 font-semibold text-lg">New Note</p>
      </div>
      {notes.map((note) => (
        <NoteItem key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NoteList;