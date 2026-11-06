const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, inviteCode } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        if (role && !['admin', 'roommate'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid account role' });
        }

        const userRole = role || 'roommate';
        let room = null;
        if (userRole === 'roommate') {
            if (!inviteCode || !inviteCode.trim()) {
                return res.status(400).json({ success: false, message: 'Please provide a room invite code' });
            }
            room = await Room.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
            if (!room) {
                return res.status(404).json({ success: false, message: 'Invalid invite code' });
            }
        }

        const normalizedEmail = email.trim().toLowerCase();
        const userExist = await User.findOne({ email: normalizedEmail });
        if (userExist) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole,
            phone: phone || '',
            roomId: room ? room._id : null,
        });

        if (newUser) {
            try {
                if (room) {
                    await Room.updateOne(
                        { _id: room._id },
                        { $addToSet: { members: newUser._id } }
                    );
                }
            } catch (error) {
                await User.findByIdAndDelete(newUser._id);
                throw error;
            }

            return res.status(201).json({
                    success: true,
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    phone: newUser.phone,
                    roomId: newUser.roomId,
                    token: generateToken(newUser._id),
                });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        const isUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (!isUser) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        if (await bcrypt.compare(password, isUser.password)) {
            res.json({
                success: true,
                _id: isUser._id,
                name: isUser.name,
                email: isUser.email,
                role: isUser.role,
                phone: isUser.phone,
                roomId: isUser.roomId,
                token: generateToken(isUser._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                roomId: user.roomId,
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            if (typeof req.body.name === 'string') {
                const name = req.body.name.trim();
                if (!name) {
                    return res.status(400).json({ success: false, message: 'Name cannot be empty' });
                }
                user.name = name;
            }

            if (typeof req.body.email === 'string') {
                const email = req.body.email.trim().toLowerCase();
                if (!email) {
                    return res.status(400).json({ success: false, message: 'Email cannot be empty' });
                }

                const existingUser = await User.findOne({
                    email,
                    _id: { $ne: user._id },
                });
                if (existingUser) {
                    return res.status(400).json({ success: false, message: 'Email already registered' });
                }
                user.email = email;
            }

            if (typeof req.body.phone === 'string') {
                user.phone = req.body.phone.trim();
            }

            if (req.body.role && ['admin', 'roommate'].includes(req.body.role)) {
                user.role = req.body.role;
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                roomId: updatedUser.roomId,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Account
const deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            await User.findByIdAndDelete(req.user._id);
            res.json({ success: true, message: 'User account deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
};