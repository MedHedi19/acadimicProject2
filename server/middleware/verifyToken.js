const jwt = require("jsonwebtoken");


const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json("Token missing");
        }

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Token is invalid");
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};


const checkOwner = (req, res, next) => {
    checkAuth(req, res, () => {
        if (req.user.role === "Owner") {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

const checkGymStaff = (req, res, next) => {
    checkAuth(req, res, () => {
        if (req.user.role === "Owner" || req.user.role === "Administration" || req.user.role === "Coach" || req.user.role === "Worker" || req.user.role === "IT-Support") {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

module.exports = {
    checkAuth,
    checkOwner,
    checkGymStaff
}