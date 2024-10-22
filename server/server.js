const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON body
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a user schema
const userSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true,
        required: true
    },
    clickCount: {
        type: Number,
        required: true
    },
    clickPower: {
        type: Number,
        required: true
    },
});

// Create a model from the user schema
const User = mongoose.model('User', userSchema);

// Endpoint to sync user data
app.post('/sync', async (req, res) => {
    const { clickCount, clickPower } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ clickCount, clickPower });

        if (!user) {
            user = new User({ clickCount, clickPower });
            await user.save(); // Save new user
            console.log('User synced successfully:', user);
        } else {
            // Update existing user
            user.clickCount = clickCount;
            user.clickPower = clickPower;
            await user.save();
            console.log('User data updated successfully:', user);
        }

        res.status(200).json({ message: 'User synced successfully!', userId: user._id }); // Return the userId
    } catch (error) {
        console.error('Error syncing user data:', error.message);
        res.status(500).send('Error syncing user data: ' + error.message);
    }
});

// Endpoint to fetch user data by ID
app.get('/user/:id', async (req, res) => {
    try {
        const userData = await User.findById(req.params.id); // Fetch specific user data by ID
        if (!userData) {
            return res.status(404).send('No user data found');
        }
        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        res.status(500).send('Error fetching user data: ' + error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
