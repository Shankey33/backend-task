import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;