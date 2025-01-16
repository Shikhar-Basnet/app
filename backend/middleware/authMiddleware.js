import jwt from 'jsonwebtoken';

export const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not valid" });
            } else {
                req.name = decoded.name;
                req.role = decoded.role;
                next();
            }
        });
    }
};

export const verifyRole = (requiredRole) => (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Status: 'Error', message: 'Unauthorized: No token provided.' });
    }

    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ Status: 'Error', message: 'Unauthorized: Invalid token.' });
        }

        // Check if the user has the required role
        if (decoded.role !== requiredRole) {
            return res.status(403).json({ Status: 'Error', message: 'Forbidden: Insufficient role.' });
        }

        // Attach user details to the request object for downstream use
        req.name = decoded.name;
        req.role = decoded.role;
        next();
    });
};
