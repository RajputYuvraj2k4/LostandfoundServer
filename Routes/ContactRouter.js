const express = require('express');
const router = express.Router();
const Contact = require('../Models/Contact'); 

// Handle POST request to /contact
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // new contact entry
        const newContact = new Contact({ name, email, message });
        await newContact.save(); // Save to MongoDB

        res.status(200).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});

module.exports = router;