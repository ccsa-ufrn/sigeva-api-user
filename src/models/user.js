import mongoose, { Schema } from 'mongoose';

mongoose.Promise = Promise;

const userSchema = new Schema({
  login: String,
  password: String,
  isActive: Boolean,
  createdAt: Date,
  modifiedAt: Date,
});

export default mongoose.model('User', userSchema);
