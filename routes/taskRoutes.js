import express from 'express';
import checkAuth from '../middlewares/checkauth.js';
import  {
  getTask,
  createTask,
  editTask,
  deleteTask,
  changeStatus
} from '../controller/taskController.js'

const router = express.Router()

router.post('/', checkAuth, createTask)

router.route('/:id')
  .get(checkAuth, getTask)
  .put(checkAuth, editTask)
  .delete(checkAuth, deleteTask)

router.patch('/status/:id', checkAuth, changeStatus)

export default router