import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["rider", "driver"], required: true },
    profilePicture: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    rating: {
      type: Number,
      default: 5,
      required: function () {
        return this.role === "driver";
      },
    },
    vehicleDetails: {
      type: {
        vehicleType: {
          type: String,
          enum: ["car", "auto", "moto"],
          required: true,
        },
        color: {
          type: String,
          enum: ["Red", "Blue", "Black", "White", "Silver", "Gray", "Green"],
          default: "Black",
          required: true,
        },
        capacity: {
          type: String,
          required: true,
        },
        numberPlet:{
          type: String,
          required: true,
        }
      },
      required: function () {
        return this.role === "driver";
      },
    },
    socketId: {
      type:String,
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || "secretKey",
    { expiresIn: "1h" }
  );
  return token;
};

UserSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

export default mongoose.model("User", UserSchema);
