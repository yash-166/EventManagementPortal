import jwt from "jsonwebtoken";

const authmiddleware = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers.authorization;

  // Check if the token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  try {
    // Verify the token
    const decoded = jwt.verify(token, "TaskManager");

    // Attach user info from token to the request object

    // console.log(decoded);
    req.user = decoded;

    console.log("auth middleware:",req.user);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired token
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const isorganizermiddleware = async (req, res, next) => {

  console.log("User role:",req.user);
  // Ensure the user is logged in and role is available
  if (!req.user || !req.user.user.role) {
    return res.status(401).json({ message: 'Unauthorized: No user found' });
  }

  // Check if the user's role is 'organizer'
  const role = req.user.user.role;

  if (role !== 'organizer') {
    return res.status(403).json({ message: 'Forbidden: You are not an organizer' });
  }

  // If role is 'organizer', proceed to the next middleware or route handler
  next();
};


const isAdminMiddleware = (req, res, next) => {
  // Ensure the user is authenticated and has a role
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: 'Unauthorized: No user found' });
  }

  // Check if the user's role is 'admin'
  const role = req.user.role;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: You do not have admin privileges' });
  }

  // If role is 'admin', proceed to the next middleware or route handler
  next();
};



export {authmiddleware,isAdminMiddleware,isorganizermiddleware};