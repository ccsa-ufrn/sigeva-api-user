import mongoose, { Schema } from 'mongoose';

mongoose.Promise = Promise;

const userSchema = new Schema({
  login: String,
  password: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
