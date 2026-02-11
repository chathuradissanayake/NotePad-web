import React, { useState, useEffect } from 'react';
import NoteList from '../components/NoteList';
import NoteModal from '../components/modals/NoteModal';
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch notes from backend
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

  // Handle add or update note
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
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Just Notepad</h1>

      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAdd}
        noteToEdit={editNote}
        clearEdit={clearEdit}
      />

      <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} onCreate={openCreateModal} />
    </div>
  );
};

export default Home;
