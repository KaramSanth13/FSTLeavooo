const express = require('express');
const { getLeaves, createLeave, updateLeave, modifyLeaveEndDate } = require('../controllers/leave');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getLeaves)
  .post(protect, authorize('Student', 'Staff'), createLeave);

router.put('/modify/:id', protect, authorize('Student', 'Staff'), modifyLeaveEndDate);

router
  .route('/:id')
  .put(protect, authorize('HOD', 'Admin'), updateLeave);

module.exports = router;
