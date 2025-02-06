const Event = require("../../models/event");
const { transformEvent } = require("./merge");



module.exports = {
    //RESOLVER FUNCTIONS
    events: async () => {
      try {
        const events = await Event.find();
        return events.map((event) => {
          return transformEvent(event);
        });
      } catch (error) {
        throw error;
      }
    },
  
    createEvent: async (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price, //+ convert to float number
        date: new Date(args.eventInput.date),
        creator: "67a2572df62d82bc09a74164",
      });
      let createdEvent;
      try {
        const result = await event.save(); //mongoose method
        createdEvent = transformEvent(result);
        const creator = await User.findById("67a2572df62d82bc09a74164");
        if (!creator) {
          throw new Error("User does not exist!");
        }
        creator.createdEvents.push(event);
        await creator.save();
        return createdEvent;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  };
  