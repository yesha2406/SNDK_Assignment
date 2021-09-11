const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];

        if (!token) {
            return res.status(401).send({
                status: "Error",
                statusCode: 401,
                message: "Invalid Authorization",
            });
        }

        let bearer = token.split(" ");
        let bearer_token = bearer[1];

        jwt.verify(bearer_token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    status: "Error",
                    statusCode: 401,
                    message: "Invalid Authorization",
                });
            }

            req.signedInUser = decoded._id;
            // req.signedInUserName = decoded.name;
            next();
        });
    } catch (error) {
        return res.status(500).send({
            status: "Error",
            statusCode: 500,
            message: error.message,
        });
    }
}