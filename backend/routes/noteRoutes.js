const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  removeImage,
} = require('../controllers/noteController');
const auth = require('../middleware/auth');
const upload = require("../middleware/upload");


router.use(auth); // 🔥 protects all routes


// CRUD routes
router.get('/', getNotes);
router.get('/:id', getNote);
router.post("/", auth, upload.array("images", 5), createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

router.delete("/:noteId/image", removeImage);



module.exports = router;
