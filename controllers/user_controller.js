const { Validator } = require("node-input-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../schemas/user_schema");

// SignUp API for Users
exports.signup = async (req, res) => {
    try {
        let valid = new Validator(req.body, {
            name: "required",
            email: "required|email",
            password: "required|minLength:6",
        });
        let matched = await valid.check();
        if (!matched) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: valid.errors,
            });
        }

        let exist_user = await User.findOne({ email: req.body.email });
        if (exist_user) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "Email already exists",
            });
        }

        const new_user = new User(req.body);

        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(new_user.password, salt, (err, hash) => {
                if (err) throw err;
                new_user.password = hash;
                new_user.save((err, user) => {
                    if (err) {
                        return res.status(400).json({
                            Status: "Error",
                            statusCode: 400,
                            err: "Unable to save the Data",
                        });
                    }

                    return res.status(200).json({
                        status: "Success",
                        statusCode: 200,
                        message: "User registered successfully",
                        data: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            created_at: user.created_at,
                            updated_at: user.updated_at,
                        },
                    });
                });
            });
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}

// SignIn API for Users
exports.signin = async (req, res) => {
    try {
        let valid = new Validator(req.body, {
            email: "required|email",
            password: "required",
        });
        let matched = await valid.check();
        if (!matched) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: valid.errors,
            });
        }

        let { email, password } = req.body;

        let exist_user = await User.findOne({ email: email });
        if (!exist_user) {
            return res.status(400).json({
                status: "Error",
                statusCode: 400,
                message: "User not found",
            });
        }

        bcrypt.compare(password, exist_user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({
                    status: "Error",
                    statusCode: 401,
                    message: "Email and password do not match",
                });
            }

            const token = jwt.sign({ _id: exist_user._id, email: exist_user.email, name: exist_user.name }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "User Signed In successfully",
                data: {
                    _id: exist_user._id,
                    name: exist_user.name,
                    email: exist_user.email,
                    token: token
                },
            });
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}
