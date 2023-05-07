import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Boolean,
    default: false
  },
  deliveryDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  typeStamps: true,
})

const Task = mongoose.model('Task', taskSchema);

export default Task;