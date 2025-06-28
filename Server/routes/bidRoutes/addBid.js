const express = require('express');
const multer = require('multer');
const { addBid } = require('../../controllers/bidController');
const authMiddleware = require('../../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
const router = express.Router();

router.post('/add', authMiddleware, upload.single('image'), addBid);
module.exports = router;
