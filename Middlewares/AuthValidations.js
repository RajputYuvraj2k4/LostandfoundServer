const signupValidation = (req, res, next) => {
    const { fname, lname, email, contact, password, cpassword } = req.body;

    // First name validation
    if (!fname || fname.length < 3 || fname.length > 100) {
        return res.status(400).json({ message: "First name is required and must be between 3 and 100 characters." });
    }

    // Last name validation
    if (!lname || lname.length < 3 || lname.length > 100) {
        return res.status(400).json({ message: "Last name is required and must be between 3 and 100 characters." });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    // Contact number validation (must be exactly 10 digits)
    const contactRegex = /^[0-9]{10}$/;
    if (!contact || !contactRegex.test(contact)) {
        return res.status(400).json({ message: "Contact number must be exactly 10 digits." });
    }

    // Password validation (must have at least 1 letter, 1 number, and 1 special character, and be 8-100 characters long)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be between 8 and 100 characters and include at least one letter, one number, and one special character." });
    }

    // Confirm password validation
    if (password !== cpassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    next(); // All validations passed, proceed to the next middleware
}

const loginValidation = (req, res, next) => {
    const { email, password } = req.body;

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    // Password validation (must be at least 8 characters long, include 1 letter, 1 number, and 1 special character)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be between 8 and 100 characters and include at least one letter, one number, and one special character." });
    }

    next(); // All validations passed, proceed to the next middleware
}

module.exports = { signupValidation, loginValidation };
