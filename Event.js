import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { 
    type: Date, 
    required: true, 
    validate: {
      validator: function (value) { 
        return value >= new Date(); 
      }, 
      message: "Event date cannot be in the past." 
    }
  },
  venue: { type: String, required: true },
  price: { type: Number, required: true },
  seats: { type: Number, required: true }, 
  availableSeats: { type: Number, required: true, default: function () { 
    return this.seats;
  } },
});

export default mongoose.model("Event", eventSchema);
