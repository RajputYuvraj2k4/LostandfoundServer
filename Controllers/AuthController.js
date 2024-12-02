const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/Users");

const signup = async (req, res) => {
    try {
        const { fname, lname, email, contact, password, cpassword } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User  already exists, you can login", success: false });
        }
        if (password !== cpassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false });
        }
        const userModel = new UserModel({ fname, lname, email, contact, password });
        userModel.password = await bcrypt.hash(password, 10);

        await userModel.save();
        console.log("User created successfully");
        res.status(201).json({
            message: "Signup successfully",
            success: true
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Email or password is wrong';

        if (!user) {
            return res.status(400).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        // Generate JWT with user ID
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id }, // Include _id in the token
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user data and token in the response
        res.status(200).json({
            message: "Login successfully",
            success: true,
            jwtToken,
            user: { _id: user._id, fname: user.fname, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};




module.exports = { signup, login };