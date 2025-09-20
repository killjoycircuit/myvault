const Jwt = require("jsonwebtoken");

// Ensure JWT_SECRET_KEY is properly loaded and validated
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
    console.error("CRITICAL ERROR: JWT_SECRET_KEY environment variable is not set!");
    console.error("Please add JWT_SECRET_KEY to your .env file");
    process.exit(1);
}

console.log("JWT_SECRET_KEY loaded:", JWT_SECRET_KEY ? "✅" : "❌");

function userMiddleware(req, res, next) {
    // Check multiple possible token locations with more flexibility
    let token = req.headers.token || 
                req.headers.authorization?.replace('Bearer ', '') || 
                req.headers.Authorization?.replace('Bearer ', '') ||
                req.header('token') ||
                req.header('x-auth-token');
    
    // Remove any extra whitespace and quotes
    if (token) {
        token = token.trim().replace(/^["']|["']$/g, '');
    }
    
    console.log("Token search results:");
    console.log("- req.headers.token:", req.headers.token ? "Present" : "Missing");
    console.log("- req.headers.authorization:", req.headers.authorization ? "Present" : "Missing");
    console.log("- Final token:", token ? `${token.substring(0, 20)}...` : "Not found");
    
    if (!token) {
        console.log("No token found in request headers");
        return res.status(401).json({
            message: "Access denied. No token provided.",
            debug: {
                headers: Object.keys(req.headers)
            }
        });
    }

    try {
        console.log("Verifying token with secret key...");
        const decodedToken = Jwt.verify(token, JWT_SECRET_KEY);
        
        console.log("Token verified successfully for user:", decodedToken.UserId);
        
        // Store userId directly on req object for easier access
        req.userId = decodedToken.UserId;
        
        // Also keep the full decoded token if needed
        req.user = decodedToken;
        
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        console.error("Token (first 20 chars):", token ? token.substring(0, 20) + "..." : "null");
        console.error("Secret key being used:", JWT_SECRET_KEY ? "Present" : "Missing");
        
        // Provide specific error messages based on error type
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token has expired. Please sign in again."
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token format or signature"
            });
        } else if (error.name === 'NotBeforeError') {
            return res.status(401).json({
                message: "Token not active yet"
            });
        } else {
            return res.status(401).json({
                message: "Invalid token",
                debug: {
                    errorType: error.name,
                    errorMessage: error.message
                }
            });
        }
    }
}

module.exports = { userMiddleware, JWT_SECRET_KEY };