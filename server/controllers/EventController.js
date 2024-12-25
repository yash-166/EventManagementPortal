import Event from "../models/Event.js";
import Organization from "../models/Organization.js";

const insertevent = async (req, res) => {
  try {
    // Log the request body (optional, for debugging)
    console.log(req.body);
    console.log(req.user);


    // Create a new Event document from the request body
    const newEvent = new Event({
      name: req.body.name,
      description: req.body.description,
      organizerId: req.user.user._id, // Assuming the user is logged in and their ID is in req.user
      date: req.body.date, // You should pass a date field in the request body
      time: req.body.time, // You should pass a time field in the request body
      slot: req.body.slot,
      restrictions: {
        department: req.body.department, // Mapping department to restrictions
        year: req.body.year, // Mapping year to restrictions
      },
      registeredUsers: req.body.registeredUsers || [], // Default to an empty array if no registered users
      status: req.body.status || 'pending', // Default to 'pending' if no status provided
      image: req.body.image || '', // You can provide a default or optional value for image
      assets: req.body.assets || [], // Default to an empty array if no assets provided
    });

    // Save the new event to the database
    const savedEvent = await newEvent.save();

    // Respond with success and the saved event data
    res.status(201).json({
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    // Handle any errors that occur during the save process
    console.error(error);
    res.status(500).json({
      message: "Error creating event",
      error: error.message,
    });
  }
};

const getevents = async (req, res) => {
  try {
    const organizerId = req.user.user._id; // Get the logged-in user's ID

    console.log(organizerId);
    
    // Find the organization(s) where the organizerId is a member
    const organization = await Organization.findOne({ members: organizerId });

    console.log(organization);
  

    if (!organization) {
      return res.status(404).json({ message: "Organizer is not a member of any organization" });
    }

    // Retrieve all events created by the organizers in the organization
    const organizationEvents = await Event.find({ organizerId: { $in: organization.members } });

    // Retrieve all events from the database
    const allEvents = await Event.find();

    // Calculate counts for organization events
    const totalOrganizationEvents = organizationEvents.length;
    const approvedOrganizationEvents = organizationEvents.filter(event => event.status === 'approved').length;
    const rejectedOrganizationEvents = organizationEvents.filter(event => event.status === 'rejected').length;
    const pendingOrganizationEvents = organizationEvents.filter(event => event.status === 'pending').length;

    // Calculate counts for all events
    const totalAllEvents = allEvents.length;
    const approvedAllEvents = allEvents.filter(event => event.status === 'approved').length;
    const rejectedAllEvents = allEvents.filter(event => event.status === 'rejected').length;
    const pendingAllEvents = allEvents.filter(event => event.status === 'pending').length;



    res.json({
      totalEvents: totalAllEvents, // Total number of events in the database
      organizationEvents: organizationEvents, // Events created by organizers in the organization
      allEvents: allEvents, // All events from the database
      totalOrganizationEvents: totalOrganizationEvents, // Total organization events
      approvedOrganizationEvents: approvedOrganizationEvents, // Approved organization events count
      rejectedOrganizationEvents: rejectedOrganizationEvents, // Rejected organization events count
      pendingOrganizationEvents: pendingOrganizationEvents, // Pending organization events count
      totalAllEvents: totalAllEvents, // Total number of events in the entire database
      approvedAllEvents: approvedAllEvents, // Approved events count in the entire database
      rejectedAllEvents: rejectedAllEvents, // Rejected events count in the entire database
      pendingAllEvents: pendingAllEvents, // Pending events count in the entire database
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};

const getallevents = async (req, res) => {
  try {
    // Fetch all events from the database
    const allEvents = await Event.find();

    // Calculate counts for events by status
    const totalEvents = allEvents.length;
    const approvedEventsCount = allEvents.filter(event => event.status === 'approved').length;
    const rejectedEventsCount = allEvents.filter(event => event.status === 'rejected').length;
    const pendingEventsCount = allEvents.filter(event => event.status === 'pending').length;

    console.log("Helloo", totalEvents, // Total number of events
      approvedEventsCount, // Approved events count
      rejectedEventsCount, // Rejected events count
      pendingEventsCount, // Pending events count
      allEvents,);

    // Send response with event data and counts
    res.status(200).json({
      totalEvents, // Total number of events
      approvedEventsCount, // Approved events count
      rejectedEventsCount, // Rejected events count
      pendingEventsCount, // Pending events count
      allEvents, // List of all events
    });
  } catch (error) {
    console.error("Error fetching all events:", error.message);

    // Handle errors with a 500 status
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};

const addfeedback = async (req, res) => {
  try {
    const { eventId, feedback } = req.body;

    // Check if the required fields are provided
    if (!eventId || !feedback) {
      return res.status(400).json({ message: 'Event ID and feedback are required.' });
    }

    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Add feedback to the feedback array
    event.feedback.push(feedback);

    // Save the updated event
    await event.save();

    return res.status(200).json({ message: 'Feedback added successfully.', event });
  } catch (error) {
    console.error('Error adding feedback:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


export { insertevent,getevents,getallevents ,addfeedback};
