const Note = require('../models/Note.js');


// GET all notes (ONLY logged-in user's notes)
const getNotes = async (req, res) => {
  try {
    const notes = await Note
      .find({ userEmail: req.user.email })   // 🔥 filter by owner
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET single note (must belong to user)
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userEmail: req.user.email, // 🔥 ownership check
    });

    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CREATE note (attach owner automatically)
const createNote = async (req, res) => {
  const { subject, body } = req.body;

  try {
    const newNote = new Note({
      subject,
      body,
      userEmail: req.user.email, // 🔥 attach owner
    });

    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// UPDATE note (only owner can update)
const updateNote = async (req, res) => {
  const { subject, body } = req.body;

  try {
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userEmail: req.user.email, // 🔥 ownership check
      },
      { subject, body },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// DELETE note (only owner can delete)
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userEmail: req.user.email, // 🔥 ownership check
    });

    if (!deletedNote) return res.status(404).json({ message: 'Note not found' });

    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
