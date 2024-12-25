const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const Request = require("./Request_Schema");
// Initialize Express App
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
async function connect() {
  const mongoUri = 'mongodb://localhost:27017/testingDb'; // Local MongoDB URI
  await mongoose.connect(mongoUri, { dbName: 'testingDb' });
  console.log(`MongoDB successfully connected to ${mongoUri}`);
}

// Define Schema and Model
const postSchema = new mongoose.Schema({
  filePath: String, // Path of uploaded file
  fileType: String,
  org_id:String,
  eventName:String // Type of the file (image/video)
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
app.get('/', async (req, res) => {
  try {
    const data = await Post.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post('/uploads', upload.single('file'), async (req, res) => {
  const { org_id,eventName} = req.body;  // Extract org_id from the request body

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a new post object with the file data and organization ID
    const newFile = new Post({
      filePath: `/uploads/${req.file.filename}`,   // Save the relative file path
      fileType: req.file.mimetype.includes('image') ? 'image' : 'video',  // Check file type
      org_id: org_id, 
      eventName:eventName // Save the organization ID
    });

    console.log("org_id: " + org_id+eventName);  // Debugging log to check the org_id

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
app.get('/gallery', async (req, res) => {
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
    const requests = await Request.find();
    res.status(200).json(requests);
    console.log(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/addRequest", async (req, res) => {
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
    const acceptedRequests = await Request.find({ status: "accepted" });  // Fetch requests where status is 'rejected'
    res.json(acceptedRequests);  // Send rejected requests as response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch accepted requests" });
  }
});
app.post('/acceptRequest/:id', async (req, res) => {
  const { eventDetails} = req.body; // Extract eventDetails and reason from the request body
  const requestId = req.params.id;
console.log("in acceptReq");
  try {
    // Find the request by ID
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the request status and rejection reason
    request.status = 'accepted';    // Update status to 'rejected'
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
// Start the Server
connect().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Database connection error:', error);
});
