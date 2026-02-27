import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Ensures email is always stored in lowercase
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin'] // Restricted to admin only since customers use WhatsApp
  },
}, { timestamps: true });

// Hash password before saving to database
// Fixed: Removed 'next' parameter to prevent "next is not a function" error in async middleware
userSchema.pre('save', async function () {
  // If the password isn't being changed (e.g. updating name), skip hashing
  if (!this.isModified('password')) {
    return;
  }

  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // In async pre-save hooks, returning or completing the function finishes the middleware
  } catch (error) {
    throw error; // Pass the error to Mongoose
  }
});

// Method to compare entered password with the hashed password in the DB
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;