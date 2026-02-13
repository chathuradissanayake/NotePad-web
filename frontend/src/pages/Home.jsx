import React, { useState, useEffect } from 'react';
import NoteList from '../components/NoteList';
import NoteModal from '../components/modals/NoteModal';
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  useEffect(() => {
    const loadNotes = async () => {
      const data = await getNotes();
      setNotes(data);
    };
    loadNotes();
  }, []);

  const handleAdd = async (note) => {
    if (editNote) {
      await updateNote(editNote._id, note);
      setEditNote(null);
    } else {
      await createNote(note);
    }
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  const clearEdit = () => setEditNote(null);

  const openCreateModal = () => {
    setEditNote(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    clearEdit();
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Just Note
          </h1>
          <p className="text-gray-600 text-lg">Your thoughts, organized beautifully</p>
        </div>

        <NoteModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleAdd}
          noteToEdit={editNote}
          clearEdit={clearEdit}
          onDelete={handleDelete}
        />

        <NoteList notes={notes} onEdit={handleEdit} onCreate={openCreateModal} />
      </div>
    </div>
  );
};

export default Home;
