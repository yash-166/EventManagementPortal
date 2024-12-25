import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;
