import express from 'express';
import Token from '../models/Token.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Purpose to counter mapping
const purposeToCounter = {
  'ID Creation': 1,
  FIR: 2,
  Passport: 3,
  Complaint: 4,
};

// @route   POST api/tokens/generate
// @desc    Generate new queue token
router.post('/generate', auth, async (req, res) => {
  const { phone, purpose, urgent } = req.body;

  try {
    // Get next token number for purpose
    const lastToken = await Token.findOne({ purpose })
      .sort({ createdAt: -1 })
      .select('tokenNumber');

    let nextNumber = 1;
    if (lastToken) {
      const match = lastToken.tokenNumber.match(/(\d+)$/);
      nextNumber = match ? parseInt(match[1]) + 1 : 1;
    }

    const prefix = purpose === 'ID Creation' ? 'ID' : 
                   purpose === 'FIR' ? 'FIR' : 
                   purpose === 'Passport' ? 'PS' : 'CMP';

    const tokenNumber = `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
    const counter = purposeToCounter[purpose];

    const token = new Token({
      phone,
      purpose,
      urgent,
      tokenNumber,
      counter,
      status: 'pending',
      userId: req.user._id,
    });

    await token.save();

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/tokens/counter/:counter/next
// @desc    Get next pending token for counter (urgent first)
router.get('/counter/:counter/next', auth, async (req, res) => {
  try {
    const counter = parseInt(req.params.counter);
    
    // Find next token: urgent first, then normal pending
    let nextToken = await Token.findOne({
      counter,
      status: 'pending'
    }).sort({
      urgent: -1,  // urgent (true) first
      createdAt: 1  // then earliest
    });

    if (!nextToken) {
      return res.json({ message: 'No tokens waiting', token: null });
    }

    // Mark as called
    nextToken.status = 'called';
    await nextToken.save();

    res.json({
      token: nextToken,
      waitingCount: await Token.countDocuments({ counter, status: 'pending' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/tokens/counter/:counter/status
// @desc    Get counter status (current serving, queue length)
router.get('/counter/:counter/status', async (req, res) => {
  try {
    const counter = parseInt(req.params.counter);
    const pendingCount = await Token.countDocuments({ counter, status: 'pending' });
    const urgentCount = await Token.countDocuments({ counter, status: 'pending', urgent: true });
    
    res.json({
      counter,
      pendingCount,
      urgentCount,
      totalWaiting: pendingCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
