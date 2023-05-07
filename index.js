import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

//CORS
const whitelist = [process.env.FRONTEND_URL];

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

//Routing
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const io = new Server(server, {
  ping: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

io.on('connection', (socket) => {
  socket.on('openProject', (project) => {
    console.log(project);
    socket.join(project)
  })

  socket.on('createTask', (task) => {
    console.log(socket.id, task.project)
    socket.to(task.project).emit('addedTask', task)
  })
  socket.on('deleteTask', (task) => {
    console.log(socket.id, task.project)
    socket.to(task.project).emit('deletedTask', task)
  })
  socket.on('editTask', (task) => {
    console.log(socket.id, task.project._id)
    socket.to(task.project._id).emit('editedTask', task)
  })
})