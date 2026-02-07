import React, { useState, useEffect } from 'react';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);

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

  const handleEdit = (note) => setEditNote(note);

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  const clearEdit = () => setEditNote(null);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">My Notepad</h1>
      <NoteForm onSubmit={handleAdd} noteToEdit={editNote} clearEdit={clearEdit} />
      <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Home;
