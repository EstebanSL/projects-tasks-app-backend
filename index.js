import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import cors from 'cors';
import { Server } from 'socket.io';

// INITIALIZATIONS
const app = express();
app.use(express.json());

/** ENVIROMENT VARIABLES */
dotenv.config();

/** DATABASE */
connectDB();

/** CORS */
const whitelist = [process.env.FRONTEND_URL];

/**  */
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Cors error'));
    }
  },
};

app.use(cors(options));

/** ROUTING */
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;

/** SERVER */
const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const io = new Server(server, {
  ping: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

/** SOCKET CONNECTION */
io.on('connection', (socket) => {
  socket.on('openProject', (project) => {
    socket.join(project)
  })

  socket.on('createTask', (task) => {
    socket.to(task.project).emit('addedTask', task)
  })
  socket.on('deleteTask', (task) => {
    socket.to(task.project).emit('deletedTask', task)
  })
  socket.on('editTask', (task) => {
    socket.to(task.project._id).emit('editedTask', task)
  })
})