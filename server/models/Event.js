import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String },
  organizer:{type: String,default:"SDCAC"},
  slot: {
    type: String,
    required: true,
    enum: ["slot1", "slot2", "slot3"]
  },
  restrictions: {
    department: [{
      type: String,
      enum: ['CSE', 'ECE', 'Mechanical', 'Civil', 'MME','EEE']
    }],
    year: [{
      type: String,
      enum: ['E1', 'E2', 'E3', 'E4']
    }],
  },
  feedback:[{type:"String"}],
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  image: {
    type: String,// Ensure the image URL is required 
    default:""
  },
  assets: [
    {
      type: {
        type: String,
        enum: ['video', 'image', 'document'], // Define allowed asset types
      },
      url: {
        type: String,
      },
      description: {
        type: String
      }
    }
  ],
});

const Event = mongoose.model('Event', EventSchema);
export default Event;
