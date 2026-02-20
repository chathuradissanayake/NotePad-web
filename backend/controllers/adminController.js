const Note = require("../models/Note");
const User = require("../models/User");
const mongoose = require("mongoose");

// 🔹 Get all notes (admin only) — support pagination
exports.getAllNotes = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || "50")));
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      Note.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Note.countDocuments(),
    ]);

    res.json({ notes, total, page, limit });
  } catch (error) {
    console.error("getAllNotes error:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// 🔹 Delete any note (with id validation)
exports.deleteAnyNote = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("deleteAnyNote error:", error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

// 🔹 Update any note (admin)
exports.updateAnyNote = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    const updated = await Note.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("updateAnyNote error:", error);
    res.status(500).json({ message: "Failed to update note" });
  }
};

// 🔹 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 🔹 Update user role (promote/demote)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

// 🔹 Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    // Optional: delete all notes of that user
    await Note.deleteMany({ user: req.params.id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
