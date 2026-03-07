const express = require('express');
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/conversations', chatController.getConversations);
router.delete('/conversations/:partnerId', chatController.deleteConversation);
router.get('/messages/:bookingId', chatController.getMessagesByBooking);
router.post('/messages', chatController.sendMessage);
router.put('/messages/:id/read', chatController.markMessageRead);

module.exports = router;
