import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['admin', 'regular'], default: 'regular' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]

}, { timestamps: true });


userSchema.methods.addTask = async function(taskId) {
    this.tasks.push(taskId);
    await this.save();
};

userSchema.methods.removeTask = async function(taskId) {
    this.tasks.pull(taskId);
    await this.save();
};


userSchema.methods.getTasks = async function() {
    await this.populate('tasks');
    return this.tasks;
};

userSchema.methods.toggleTaskStatus = async function(taskId) {
    await this.populate('tasks');
    const task = this.tasks.find(t => t._id.toString() === taskId.toString());
    if (!task) {
        throw new Error('Task not found for this user');
    }
    task.completed = !task.completed;
    await task.save();
    return task.completed;
};

const User = mongoose.model('User', userSchema);
export default User;