const Note = require('../models/Note.js');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const { v4: uuidv4 } = require("uuid");


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
    let imageUrls = [];

    // If images exist
    if (req.files && req.files.length > 0) {
      // Validate total number of images
      if (req.files.length > 5) {
        return res.status(400).json({ message: "Maximum 5 images allowed per note" });
      }

      for (const file of req.files) {
        try {
          const fileName = `notes/${req.user.email}/${uuidv4()}-${file.originalname}`;

          const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
          };

          await s3.send(new PutObjectCommand(uploadParams));

          const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
          imageUrls.push(imageUrl);

        } catch (s3Error) {
          console.error("S3 Upload Error:", s3Error);
          
          // Rollback: delete already uploaded images
          for (const uploadedUrl of imageUrls) {
            const key = uploadedUrl.split(".amazonaws.com/")[1];
            await s3.send(new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            })).catch(err => console.error("Rollback error:", err));
          }
          
          return res.status(500).json({ message: "Failed to upload images to S3" });
        }
      }
    }

    const newNote = new Note({
      subject,
      body,
      userEmail: req.user.email,
      images: imageUrls,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);

  } catch (error) {
    console.error("Create note error:", error);
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
    const note = await Note.findOne({
      _id: req.params.id,
      userEmail: req.user.email,
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    // Delete all images from S3
    const deletePromises = note.images.map(async (imageUrl) => {
      try {
        const key = imageUrl.split(".amazonaws.com/")[1];
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        }));
      } catch (s3Error) {
        console.error(`Failed to delete image ${imageUrl}:`, s3Error);
        // Continue deletion even if S3 fails
      }
    });

    await Promise.allSettled(deletePromises);
    await note.deleteOne();

    res.json({ message: "Note and images deleted successfully" });

  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: error.message });
  }
};


const removeImage = async (req, res) => {
  const { noteId } = req.params;
  const { imageUrl } = req.body;

  try {
    const note = await Note.findOne({
      _id: noteId,
      userEmail: req.user.email,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if image exists in note
    if (!note.images.includes(imageUrl)) {
      return res.status(400).json({ message: "Image not found in note" });
    }

    // Extract S3 Key from URL
    const key = imageUrl.split(".amazonaws.com/")[1];

    // Delete from S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );

    // Remove from MongoDB array
    note.images = note.images.filter((img) => img !== imageUrl);
    await note.save();

    res.json({ message: "Image removed successfully", note });

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
  removeImage,
};
