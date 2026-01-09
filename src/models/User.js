import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['admin', 'regular'], default: 'regular' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;