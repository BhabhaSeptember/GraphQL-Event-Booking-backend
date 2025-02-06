const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");


module.exports = {
  //RESOLVER FUNCTIONS
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User already exists!");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12); //SALT, 12 rounds of hashing

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
  login: async ({email, password}) => {
    try {
        const user = await User.findOne({email: email});

        if(!user) {
            throw new Error("User does not exist!");
        }
      const isEqual =  await bcrypt.compare(password, user.password); //hashes input then compares that to known hashed password

      if (!isEqual) {
        throw new Error("Incorrect Password!");
      }
      const token = jwt.sign({userId: user.id, email: user.email}, "somesupersecretkey", {
        expiresIn: "1h"
      }); //generates token hashed with the second arg? anything hashed without this key will be invalid
      return { userId: user.id, token: token, tokenExpiration: 1}

    } catch (error) {
        throw error;
    }
  }
};
