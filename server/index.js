import express from "express";
import { connectdb } from "./utils/db.js";
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoute.js';
import notificationRoutes from './routes/notificationRoutes.js';
// import Request from './Request_Schema.js'
import mongoose from "mongoose";
import multer from "multer";
import Request from "./models/Event.js";
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
const app = express();
import { authmiddleware } from "./middleware/authmiddleware.js";

app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  methods: "GET,POST,PUT,DELETE", // Allowed methods
  credentials: true // If you're using cookies
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
// Define Schema and Model
const postSchema = new mongoose.Schema({
  filePath: String, // Path of uploaded file
  fileType: String,
  org_id: String,
  eventName: String // Type of the file (image/video)
});

const Post = mongoose.models.posts || mongoose.model('post', postSchema);

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

// Routes
// app.get('/', async (req, res) => {
//   try {
//     const data = await Post.find({});
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

app.post('api/events/uploads', upload.single('file'), async (req, res) => {
  const { org_id, eventName } = req.body;  // Extract org_id from the request body

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a new post object with the file data and organization ID
    const newFile = new Post({
      filePath: `/uploads/${req.file.filename}`,   // Save the relative file path
      fileType: req.file.mimetype.includes('image') ? 'image' : 'video',  // Check file type
      org_id: org_id,
      eventName: eventName // Save the organization ID
    });

    console.log("org_id: " + org_id + eventName);  // Debugging log to check the org_id

    // Save the new file information to the database
    await newFile.save();
    console.log(newFile);  // Log the newly saved file object

    // Send success response
    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    console.error('Error uploading file:', error);  // Log error if it occurs
    res.status(500).json({ error: error.message });
  }
});
app.get('api/events/gallery', async (req, res) => {
  const { eventName, org_id } = req.query; // Get eventName and org_id from query parameters

  try {
    // Find images based on eventName and org_id
    const posts = await Post.find({ eventName, org_id });

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No images found for the given event and organization' });
    }

    // Respond with the image paths (URLs)
    const imageUrls = posts.map(post => post.filePath);
    res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/getRequests", async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" });
    res.status(200).json(requests);
    console.log(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("api/events/addRequest", async (req, res) => {
  const { organizer, eventName, date, time } = req.body;
  try {
    const newRequest = new Request({ organizer, eventName, date, time });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/rejectRequest/:id', async (req, res) => {
  const { eventDetails, reason } = req.body; // Extract eventDetails and reason from the request body
  const requestId = req.params.id;
  console.log("in rejectReq");
  try {
    // Find the request by ID
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the request status and rejection reason
    request.status = 'rejected';    // Update status to 'rejected'
    request.rejectionReason = reason;  // Save the rejection reason

    // Optionally, save eventDetails if necessary (you may already have this in your model)
    request.eventDetails = eventDetails;

    await request.save(); // Save the updated request
    console.log(request);
    res.status(200).json(request); // Send back the updated request
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.get("/getRejectedRequests", async (req, res) => {
  try {
    const rejectedRequests = await Request.find({ status: "rejected" });  // Fetch requests where status is 'rejected'
    res.json(rejectedRequests);  // Send rejected requests as response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rejected requests" });
  }
});
app.get("/getAcceptedRequests", async (req, res) => {
  try {
    const acceptedRequests = await Request.find({ status: "approved" });  // Fetch requests where status is 'rejected'
    res.json(acceptedRequests);  // Send rejected requests as response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch accepted requests" });
  }
});
app.post('/acceptRequest/:id', async (req, res) => {
  const { eventDetails } = req.body; // Extract eventDetails and reason from the request body
  const requestId = req.params.id;
  console.log("in acceptReq");
  try {
    // Find the request by ID
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the request status and rejection reason
    request.status = 'approved';    // Update status to 'rejected'
    request.rejectionReason = "accepted";  // Save the rejection reason

    // Optionally, save eventDetails if necessary (you may already have this in your model)
    request.eventDetails = eventDetails;

    await request.save(); // Save the updated request
    console.log(request);
    res.status(200).json(request); // Send back the updated request
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/events", async (req, res) => {
  const { sort, organizer, branch, year } = req.query;

  let filter = {};
  if (organizer) filter.organizer = organizer;
  if (branch) filter.branch = branch;
  if (year) filter.year = year;

  let sortOptions = {};
  if (sort === "asc") {
    sortOptions.date = 1;
  } else if (sort === "desc") {
    sortOptions.date = -1;
  }

  try {
    const events = await Request.find(filter).sort(sortOptions);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});
// A default route
app.get("/", (req, res) => {
  res.send("Hello world");
});
app.post('/generate-report', (req, res) => {
  const { Organizer, Event, Date, Time } = req.body;
  console.log(req.body)
  // Create a new PDF document
  const doc = new PDFDocument();
  const fileName = 'report.pdf';

  // Pipe the PDF to a file
  doc.pipe(fs.createWriteStream(fileName));

  // Add content to the PDF
  doc.fontSize(12)
    .text("Official Event Acceptance Report ", { align: 'center' })
    .moveDown(2)
    .text(`Organization: ${Organizer}`)
    .text(`Event Date: ${Date}`)
    .text(`Event Time: ${Time}`)
    .text(`Event Place: SAC`)
    .moveDown(1)
    .text('We are pleased to confirm that the organizer can use the place on the specified date.')
    .end();

  // Wait for the PDF to finish writing
  doc.on('end', () => {
    // Set up Nodemailer transport (using a mail service like Gmail)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chanduchintalapudi9@gmail.com',
        pass: 'oksf pdrz vxmc mfbi'
      }
    });

    // Send email to the organizer with the PDF attached
    let mailOptions = {
      from: 'chanduchintalapudi9@gmail.com',
      to: 'donthuviswani@gmail.com',
      subject: 'Event Booking Confirmation',
      text: 'Please find the event booking confirmation report attached.',
      attachments: [
        {
          filename: fileName,
          path: `./${fileName}`// Path to the generated PDF file
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false });
      }
      console.log('Email sent: ' + info.response);

      // Optionally, you can also provide the file for download to the admin
      res.status(200).json({ success: true });
    });
  });
});



app.post('/send-confirm-mail',async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'chanduchintalapudi9@gmail.com',
      pass: 'oksf pdrz vxmc mfbi'
    }



  },

  );


  const mailOptions = {
    from: 'chanduchintalapudi9@gmail.com',
    to: 'donthuviswani@gmail.com',

    subject: 'Confirmation Email',
    text: 'Thank you for registering. Please confirm your email.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email.' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Confirmation email sent.' ,ok:true});

  });
  // console.log("body:",req.body);
  // console.log("User Id:",req.user.id);
  // const { eventId } = req.body;
  // const userId = req.user.user.id;

  // // Find the Event document by eventId and add the userId to the registeredUsers array
  // try {
  //   const event = await Event.findByIdAndUpdate(
  //     eventId,
  //     { $addToSet: { registeredUsers: userId } }, // Add userId to the registeredUsers array
  //     { new: true, runValidators: true } // Return the updated event and run validators
  //   );

  //   if (!event) {
  //     return res.status(404).json({ message: 'Event not found' });
  //   }

  //   // Respond with the updated event
  //   res.status(200).json({ message: 'User successfully registered for the event.' });
  // } catch (err) {
  //   console.error('Error updating event:', err);
  //   res.status(500).json({ message: 'Failed to register user for the event.' });
  // }
});
const port = 3000;

connectdb().then(
  app.listen(port, () => {
    console.log(`Listening on the port ${port}`);
  })
)

