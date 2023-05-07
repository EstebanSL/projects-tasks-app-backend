import express from 'express';
import checkAuth from '../middlewares/checkauth.js';
import {
  addPartner,
  createProject,
  deletePartner,
  deleteProject,
  editProject,
  getProject,
  getProjects,
  searchPartner,
} from '../controller/projectController.js';

const router = express.Router();

router.route('/').get(checkAuth, getProjects).post(checkAuth, createProject);

router
  .route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject);

router.post('/partners', checkAuth, searchPartner)
router.post('/partners/:id', checkAuth, addPartner);
router.post('/delete-partner/:id', checkAuth, deletePartner);

export default router;
