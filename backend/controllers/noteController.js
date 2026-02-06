const Note = require('../models/Note.js');

// GET all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single note
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE note
const createNote = async (req, res) => {
  const { subject, body } = req.body;
  try {
    const newNote = new Note({ subject, body });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE note
const updateNote = async (req, res) => {
  const { subject, body } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { subject, body },
      { new: true } // return the updated note
    );
    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE note
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, getNote, createNote, updateNote, deleteNote };
