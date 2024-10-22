const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a user schema
const userSchema = new mongoose.Schema({
    clickCount: {
        type: Number,
        required: true,
        default: 0
    },
    username: {
        type: String,
        required: true,
        unique: true // Ensure unique usernames
    },
    password: {
        type: String,
        required: true
    },
    clickPower: {
        type: Number,
        required: true,
        default: 1
    }
});

// Create a model from the user schema
const User = mongoose.model('User', userSchema);

// Endpoint to sync user data (signup or login and update data)
app.post('/sync', async (req, res) => {
    const { clickCount, clickPower, username, password } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user) {
            // Create a new user if not found
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ clickCount, clickPower, username, password: hashedPassword });
            await user.save();
            console.log('User created successfully:', user);
        } else {
            // If the user is found, verify the password
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            
            // Update user data
            user.clickCount = clickCount;
            user.clickPower = clickPower;
            await user.save();
            console.log('User data updated successfully:', user);
        }

        res.status(200).json({ message: 'User synced successfully!', userId: user._id });
    } catch (error) {
        console.error('Error syncing user data:', error.message);
        res.status(500).json({ message: 'Error syncing user data: ' + error.message });  // Ensure response is in JSON
    }
});

// New endpoint to find a user by credentials
app.get('/user/findByCredentials', async (req, res) => {
    const { username, password } = req.query;

    // Log what the server is receiving
    console.log('Request received with username:', username, 'and password:', password);

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Log found user data (be careful not to log passwords in production)
        console.log('User found:', user);

        // Compare the password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Return the userId if the credentials are correct
        console.log('Password is correct, returning userId:', user._id);
        res.status(200).json({ userId: user._id });
    } catch (error) {
        console.error('Error finding user by credentials:', error.message);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// New endpoint to fetch user data by ID
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;  // Use req.params to get the user ID from the URL

    try {
        // Validate if it's a correct MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch the user data using the user ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Return the user data
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});