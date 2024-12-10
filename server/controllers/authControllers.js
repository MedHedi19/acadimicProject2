const User = require("../models/userSchema");
const Crypt = require("crypto-js");
const jwt = require("jsonwebtoken");

async function Login(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json("Wrong credentials - User not found");
        }

        const hashedPassword = Crypt.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPassword.toString(Crypt.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(401).json("Wrong credentials - Incorrect password");
        }
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_KEY,
            { expiresIn: "3d" }
        );
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
}

async function StaffLogin(req, res) {
    try {
        const { staffID, password } = req.body;

        if (!staffID || !password) {
            return res.status(400).json("StaffID and password are required");
        }

        // Find user by staffID
        const user = await User.findOne({ staffID });

        if (!user) {
            return res.status(401).json("Wrong credentials - User not found");
        }

        // Decrypt and verify password
        const hashedPassword = Crypt.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(Crypt.enc.Utf8);

        if (originalPassword !== password) {
            return res.status(401).json("Wrong credentials - Incorrect password");
        }

        // Generate token
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_KEY,
            { expiresIn: "3d" }
        );

        // Exclude password from the response
        const { password: userPassword, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
}


async function getStaffUsers(req, res) {
    try {
        const staffRoles = ["Administration", "Owner", "Coach", "Worker", "IT-Support"];

        // Fetch users, excluding the 'image' and 'password' fields
        const staffUsers = await User.find({ role: { $in: staffRoles } }).select('-image -password');

        res.status(200).json(staffUsers);
    } catch (err) {
        res.status(500).json(err);
    }
}



async function addUser(req, res) {
    try {
        const { username, email, phoneNumber, password, role, image } = req.body;

        if (!username || !email || !phoneNumber || !password || !image || !role) {
            return res.status(400).json("All fields are required");
        }

        const validRoles = ["Coach", "Administration", "Owner", "IT-Support", "Worker", "Client"];
        if (!validRoles.includes(role)) {
            return res.status(400).json("Invalid role");
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }, { phoneNumber }],
        });

        if (existingUser) {
            return res.status(400).json("These details are already in use.");
        }

        const hashedPassword = Crypt.AES.encrypt(password, process.env.PASS_SEC).toString();

        let staffID = null;
        const firstTwoLetters = username.substring(0, 2).toUpperCase(); // First 2 letters of username
        let randomNumber = Math.floor(100 + Math.random() * 900); // Random 3-digit number
        staffID = `${firstTwoLetters}-${randomNumber}`;

        // Check if the generated staffID already exists
        let staffIDExists = await User.findOne({ staffID });
        while (staffIDExists) {
            // Regenerate staffID if it exists
            randomNumber = Math.floor(100 + Math.random() * 900);
            staffID = `${firstTwoLetters}-${randomNumber}`;
            staffIDExists = await User.findOne({ staffID });
        }


        // Only include staffID if it's not null (for non-client roles)
        const newUser = new User({
            username,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            image,
            staffID
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}



async function deleteUser(req, res) {
    try {
        const { userId } = req.params;

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json("User not found");
        }

        res.status(200).json("User has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
}



async function getPersonalInfo(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json("User not found");
        }

        const { password, ...personalInfo } = user._doc;
        res.status(200).json(personalInfo);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function editPersonalInfo(req, res) {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json("User not found");
        }

        const { password, ...updatedInfo } = updatedUser._doc;
        res.status(200).json(updatedInfo);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getClient(req, res) {
    try {
        // Fetch only users with the 'Client' role
        const clients = await User.find({ role: "Client" }).select('-image -password');;

        if (!clients || clients.length === 0) {
            return res.status(404).json("No clients found");
        }

        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json(err);
    }
}
async function getUserById(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json("User not found");
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    Login,
    StaffLogin,
    getStaffUsers,
    addUser,
    deleteUser,
    getPersonalInfo,
    editPersonalInfo,
    getClient,
    getUserById
};
