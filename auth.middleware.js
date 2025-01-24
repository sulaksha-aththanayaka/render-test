import jwt from "jsonwebtoken";

export const authenticateUser = (
  req,
  res,
  next
) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // Verify access token
    try {
      const decoded = jwt.verify(accessToken, JWT_SECRET);
      req.user = { id: decoded.id }; // Attach user ID to request
      return next(); // Token is valid, proceed to the next middleware
    } catch (error) {
      if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") { 
        // Token is expired, try refreshing
        if (!refreshToken) {
          throw new Error("Authentication failed. Refresh token missing.");
        }

        try {
          const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET);

          // Generate a new access token
          const newAccessToken = jwt.sign(
            { id: decodedRefresh.id },
            JWT_SECRET,
            { expiresIn: "59m" }
          );

          // Set the new access token in cookies
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
          });

          // Attach user ID and proceed
          req.user = { id: decodedRefresh.id };
          return next();
        } catch (refreshError) {
          throw new Error("Authentication failed. Invalid refresh token.");
        }
      } else {
        throw new Error("Authentication failed. Invalid token.");
      }
    }
  } catch (error) {
    return res.status(401).json({ error: error.message || "Unauthorized" });
  }
};
