const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudnaryConfig');
const Item = require('../Models/Item');
const jwt = require('jsonwebtoken');

// Multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lost_and_found', // Folder in Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg'], // Supported formats
    },
});

const upload = multer({ storage });

// Route to get items for a specific user (mylistings)
router.get('/items/mylistings', async (req, res) => {
    console.log('Received request for mylistings:', req.headers);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        if (!decoded || !decoded._id) {
            console.error('Invalid token structure');
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        const userId = decoded._id;
        console.log('Fetching items for userId:', userId);

        const userItems = await Item.find({ userId: userId });
        console.log('Fetched user items:', userItems);
        return res.json(userItems);
    } catch (error) {
        console.error('Error fetching user listings:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format', error: error.message });
        }
        return res.status(500).json({ message: 'Error fetching user listings', error: error.message });
    }
});

// Route to create a new item
router.post('/items', upload.single('itemImages'), async (req, res) => {
    const { itemname, description, itemquestion, type } = req.body;

    if (!itemname || !description || !itemquestion || !type || !req.file) {
        return res.status(400).json({ error: 'All fields including an image are required' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const imageUrl = req.file.path;
        const publicId = req.file.filename;

        const newItem = new Item({
            itemname,
            description,
            itemquestion,
            type,
            images: [{ url: imageUrl, public_id: publicId }],
            userId: userId
        });

        await newItem.save();
        res.status(201).json({ message: 'Item registered successfully', item: newItem });
    } catch (error) {
        console.error('Error registering item:', error);
        res.status(500).json({ message: 'Error registering item', error });
    }
});

// Route to get all items
router.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items', error });
    }
});

// Route to get a specific item by ID
router.get('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Error fetching item', error });
    }
});

// Route to update an item by ID
router.put('/items/:id', upload.single('itemImages'), async (req, res) => {
    const { id } = req.params;
    const { itemname, description, itemquestion, type } = req.body;

    if (!itemname || !description || !itemquestion || !type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this item' });
        }

        item.itemname = itemname;
        item.description = description;
        item.itemquestion = itemquestion;
        item.type = type;

        if (req.file) {
            const imageUrl = req.file.path;
            const publicId = req.file.filename;
            item.images = [{ url: imageUrl, public_id: publicId }];
        }

        await item.save();
        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Error updating item', error });
    }
});

// Route to delete an item by ID
router.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this item' });
        }

        await Item.findByIdAndDelete(id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item', error });
    }
});

module.exports = router;