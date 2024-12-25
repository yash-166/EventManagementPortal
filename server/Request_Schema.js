import mongoose from "mongoose";
const requestSchema1 = new mongoose.Schema({
  organizer: { type: String, required: true },
  eventName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  year:{type:String},
branch:{type:String},
  status: { type: String, enum: ["accepted", "rejected", "pending"], default: "pending" },
  rejectionReason: { type: String, default: null },
});

const  Request = mongoose.model('Booking', requestSchema1);

export default Request;
