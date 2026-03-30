const express = require('express');
const { register, login, getMe, updateDetails, updatePassword, getUsers, deleteUser } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

router.route('/users')
  .get(protect, authorize('Admin'), getUsers);

router.route('/users/:id')
  .delete(protect, authorize('Admin'), deleteUser);

module.exports = router;
