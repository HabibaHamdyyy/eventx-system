import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  qrCode: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  checkedIn: { type: Boolean, default: false }
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
