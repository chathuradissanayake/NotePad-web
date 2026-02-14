import React from 'react';

const NoteItem = ({ note, onEdit }) => {
  return (
    <div 
      onClick={() => onEdit(note)}
      className="group cursor-pointer bg-linear-to-br from-white to-cyan-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-h-62.5 flex flex-col border border-cyan-200"
    >
      {/* Note content */}
      <div className="flex-1 p-4 md:p-6 overflow-hidden">
        <h3 className="font-bold text-base md:text-xl mb-2 md:mb-3 text-gray-800 line-clamp-2">
          {note.subject}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm line-clamp-4 md:line-clamp-5 whitespace-pre-wrap">
          {note.body}
        </p>
      </div>

      {/* Footer with timestamp */}
      <div className="px-4 md:px-6 py-3 md:py-4 bg-linear-to-r from-cyan-50 to-teal-50 border-t border-cyan-100 rounded-b-xl">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default NoteItem;
