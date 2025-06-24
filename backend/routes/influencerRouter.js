const express = require('express');
const router = express.Router();
const influencerController = require('../controllers/influencerController');
const authController = require('../controllers/authController');

// Protect all routes and restrict to admin
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// Get all influencers
router.get('/', influencerController.getAllInfluencers);

// Get influencer by referral code
router.get('/code/:code', influencerController.getInfluencerByCode);

// Get order count for a referral code
router.get('/code/:code/stats', influencerController.getCodeCount);

// Get influencer by MongoDB ID
router.get('/:id', influencerController.getInfluencer);

// Create influencer
router.post('/', influencerController.createInfluencer);

// Delete influencer by ID
router.delete('/:id', influencerController.deleteInfluencer);

// (Optional) Update influencer info by ID
router.patch('/:id', influencerController.updateInfluencer);


module.exports = router;
