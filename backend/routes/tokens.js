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
      userId: req.user._id,
    });

    await token.save();

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
