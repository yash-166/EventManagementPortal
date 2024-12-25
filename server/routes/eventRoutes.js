import express from "express";
import { authmiddleware, isAdminMiddleware, isorganizermiddleware } from "../middleware/authmiddleware.js";
import { insertevent,getevents,getallevents,addfeedback } from "../controllers/EventController.js";
// import Organization from "../models/Organization.js";
const router = express.Router();


router.post("/insertevent",authmiddleware,isorganizermiddleware,insertevent);
router.get("/getevent",authmiddleware,getevents);

router.get("/getallevents",authmiddleware,getallevents);

// const insertorg = async (req, res) => {
//     try {
//       // Create the organizations
//       const organizations = [
//         { name: 'SDCAC', description: 'A student organization focused on campus activities.' },
//         { name: 'Student Mitra', description: 'A platform for student support and resources.' },
//         { name: 'E Crush', description: 'An online dating platform for students.' }
//       ];
  
//       // Insert the organizations into the database
//       const insertedOrganizations = await Organization.insertMany(organizations);
  
//       // Send a success response
//       res.status(201).json({
//         message: 'Organizations created successfully',
//         organizations: insertedOrganizations,
//       });
//     } catch (error) {
//       // Handle errors
//       console.error('Error inserting organizations:', error);
//       res.status(500).json({
//         message: 'Error inserting organizations',
//         error: error.message,
//       });
//     }
//   };


// router.post("/insertorg",insertorg);

router.post("/addfeedback",authmiddleware,addfeedback);
export default router;