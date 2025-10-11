import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  year: { type: String },
  gender: { type: String },
  skills: { type: [String], default: [] },
  trackPreference: { type: [String], default: [] },
  bio: { type: String },
  raNumber: {
    type: String,
    match: /^RA\d{13}$/, // must start with RA and 13 digits
    unique: true,
    sparse: true // allows null/undefined
  },
  techStack: { type: [String], default: [] }, // array of strings
  mostPreferredRole: { type: String },
  hackathonsParticipated: { type: String, default: "" },
  hackathonsWon: { type: String, default: "" },
  projects: { type: [String], default: [] },
  mostPreferredDomain: { type: String },

  // Matching fields
  selectedUsers: { type: [Schema.Types.ObjectId], ref: "authuser", default: [] },
  pendingRequests: { type: [Schema.Types.ObjectId], ref: "authuser", default: [] },
  matches: { type: [Schema.Types.ObjectId], ref: "authuser", default: [] }

}, { timestamps: true });


const UserModel = mongoose.model('authuser', UserSchema);
export default UserModel;