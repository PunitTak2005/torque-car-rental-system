const Contact = require('../models/Contact');

// @desc    Submit a support contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Support request submitted successfully. We will reach out to you shortly.',
      contact
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact
};
