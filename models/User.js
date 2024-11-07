const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Function to generate unique loginID like FTB-{random4digits}
function generateLoginID() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
  return `FTB-${randomDigits}`;
}

const UserSchema = new mongoose.Schema(
  {
    loginID: {
      type: String,
      unique: true,
      default: generateLoginID, // Automatically generate a custom unique login ID
    },
    image: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    currentAddress: {
      type: String,
      required: true,
    },
    role: {
      type: Object, // Role is an object, storing both label and value
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    plainPassword: {
      type: String,
      required: true,
    },
    statusID: {
      type: Number,
      default: 1, // or whatever the default is
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
