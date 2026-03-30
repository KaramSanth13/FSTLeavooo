const express = require('express');
const { getLeaves, createLeave, updateLeave, modifyLeaveEndDate } = require('../controllers/leave');
const { getStats, getAuditLogs } = require('../controllers/stats');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getLeaves)
  .post(protect, authorize('Student', 'Staff'), createLeave);

router.get('/stats/summary', protect, authorize('HOD', 'Admin'), getStats);
router.get('/audit/:id', protect, getAuditLogs);

router.put('/modify/:id', protect, authorize('Student', 'Staff'), modifyLeaveEndDate);

router
  .route('/:id')
  .put(protect, authorize('HOD', 'Admin'), updateLeave);

module.exports = router;
