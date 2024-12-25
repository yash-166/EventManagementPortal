import User from "../models/User.js"

import jwt from "jsonwebtoken";

const SECRET_KEY = "TaskManager"; // Replace with your secure secret key

const loginUser = async (req, res) => {
    try {   
        console.log("chandu");
        const { email, password } = req.body;

        console.log(email + " " + password);

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required." });
        }

        // Find user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // Directly compare passwords (Consider using hashed passwords in production)
        if (user.password !== password) {
            return res.status(401).send({ message: "Invalid credentials." });
        }

        console.log(user);

        // Generate JWT token
        const token = jwt.sign(
            {user:user}, // Payload
            SECRET_KEY, // Secret Key
            { expiresIn: "10h" } // Token Expiration
        );

        // Respond with success message, token, and user data
        res.status(200).send({
            message: "Login successful.",
            token: token,
            user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error." });
    }
};

const insertUser = async (req, res) => {
    try {
      const users = [
        // 12 students
        { name: 'Student1', email: 'student1@example.com', password: 'password1', role: 'student', department: 'CSE', year: 'E1' },
        { name: 'Student2', email: 'student2@example.com', password: 'password2', role: 'student', department: 'ECE', year: 'E2' },
        { name: 'Student3', email: 'student3@example.com', password: 'password3', role: 'student', department: 'Mechanical', year: 'E3' },
        { name: 'Student4', email: 'student4@example.com', password: 'password4', role: 'student', department: 'CSE', year: 'E4' },
        { name: 'Student5', email: 'student5@example.com', password: 'password5', role: 'student', department: 'MME', year: 'E1' },
        { name: 'Student6', email: 'student6@example.com', password: 'password6', role: 'student', department: 'Civil', year: 'E2' },
        { name: 'Student7', email: 'student7@example.com', password: 'password7', role: 'student', department: 'CSE', year: 'E3' },
        { name: 'Student8', email: 'student8@example.com', password: 'password8', role: 'student', department: 'ECE', year: 'E4' },
        { name: 'Student9', email: 'student9@example.com', password: 'password9', role: 'student', department: 'Mechanical', year: 'E1' },
        { name: 'Student10', email: 'student10@example.com', password: 'password10', role: 'student', department: 'CSE', year: 'E2' },
        { name: 'Student11', email: 'student11@example.com', password: 'password11', role: 'student', department: 'ECE', year: 'E3' },
        { name: 'Student12', email: 'student12@example.com', password: 'password12', role: 'student', department: 'MME', year: 'E4' },
  
        // 5 organizers
        { name: 'Organizer1', email: 'organizer1@example.com', password: 'password1', role: 'organizer' },
        { name: 'Organizer2', email: 'organizer2@example.com', password: 'password2', role: 'organizer' },
        { name: 'Organizer3', email: 'organizer3@example.com', password: 'password3', role: 'organizer' },
        { name: 'Organizer4', email: 'organizer4@example.com', password: 'password4', role: 'organizer' },
        { name: 'Organizer5', email: 'organizer5@example.com', password: 'password5', role: 'organizer' },
  
        // 3 admins
        { name: 'Admin1', email: 'admin1@example.com', password: 'password1', role: 'admin', department: null, year: null },
        { name: 'Admin2', email: 'admin2@example.com', password: 'password2', role: 'admin', department: null, year: null },
        { name: 'Admin3', email: 'admin3@example.com', password: 'password3', role: 'admin', department: null, year: null },
      ];
  
      // Insert all users into the database
      await User.insertMany(users);
  
      res.status(201).json({ message: 'Users created successfully', users });
    } catch (error) {
      res.status(500).json({ message: 'Error inserting users', error: error.message });
    }
  };


  const Userdata = async (req, res) => {
    try {
  
      const email = req.user.user.email;

      console.log(email);
  
      // Use `await` to resolve the promise from `findOne`
      const userdetails = await User.findOne({ email });
  
      // console.log("Retrieved user details:", userdetails);
      if (!userdetails) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.json({
        message: "Message sent successfully",
        user: userdetails, // Send the user details in the response
      });
    } catch (error) {
      console.error("Error retrieving user details:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export {loginUser,insertUser,Userdata};