import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true }
});

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
