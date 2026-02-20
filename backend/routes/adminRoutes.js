const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

const {getAllNotes, deleteAnyNote, getAllUsers, updateUserRole, deleteUser} = require("../controllers/adminController");

// Protect all admin routes
router.use(auth, requireAdmin);

// Notes
router.get("/notes", getAllNotes);
router.delete("/notes/:id", deleteAnyNote);

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
