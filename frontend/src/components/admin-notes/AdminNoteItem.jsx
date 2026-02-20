import React from "react";

const AdminNoteItem = ({ note, onEdit }) => {
  const created = note?.createdAt ? new Date(note.createdAt) : null;
  const updated = note?.updatedAt ? new Date(note.updatedAt) : null;
  const isUpdated = updated && created && updated.getTime() > created.getTime();
  const label = isUpdated ? "Updated" : "Created";
  const time = (isUpdated ? updated : created)?.toLocaleString();

  return (
    <div
      onClick={() => onEdit(note)}
      className="group cursor-pointer bg-linear-to-br from-white to-cyan-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-62.5 flex flex-col border border-cyan-200"
    >
      <div className="flex-1 p-3 md:p-4 overflow-hidden flex flex-col">
        <h3 className="font-bold text-sm md:text-base mb-1.5 md:mb-2 text-gray-800 line-clamp-1">
          {note.subject}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm flex-1 overflow-hidden whitespace-pre-wrap break-all leading-tight">
          {note.body}
        </p>
      </div>

      <div className="px-3 md:px-4 py-2 md:py-2.5 bg-linear-to-r from-cyan-50 to-teal-50 border-t border-cyan-100 rounded-b-xl shrink-0">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] text-gray-500">{label}:</span>
            <span className="ml-1 text-[11px] text-gray-400">{time}</span>
          </p>

          <p className="text-[11px] text-gray-500 truncate ml-4 max-w-[40%] text-right">
            <svg className="inline w-3 h-3 mr-1 align-text-bottom text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {note.userEmail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNoteItem;