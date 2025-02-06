const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");


module.exports = {
  //RESOLVER FUNCTIONS

  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "67a2572df62d82bc09a74164",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return transformBooking(result);
  },

  cancelBooking: async (args) => {
    try {
        const booking = await Booking.findById(args.bookingId).populate("event");
        const event = transformEvent(booking.event);
        await Booking.deleteOne({_id: args.bookingId});
        return event;
      

    } catch (error) {
      throw error;
    }
  },
};
