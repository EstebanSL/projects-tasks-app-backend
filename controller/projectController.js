import Project from '../model/Project.js';
import User from '../model/User.js';

/**
 * [getProjects]
 * @description Returns the list of projects for the logged user
 */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ partners: { $in: req.user } }, { creator: { $in: req.user } }],
    }).select('-tasks');
    return res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: 'There was an error' });
  }
};

/**
 * [createProject]
 * @description Create a projects for the logged user
 */
const createProject = async (req, res) => {
  const project = new Project(req.body);

  project.creator = req.user._id;

  try {
    const savedProject = await project.save();
    return res.status(201).json(savedProject);
  } catch (error) {
    return res.status(404).json({ msg: 'There was an error' });
  }
};

/**
 * [getProject]
 * @description Returns a specific project for the logged user
 */
const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id)
      .populate({ path: 'tasks', populate: { path: 'completedBy', select: 'username'}})
      .populate('partners', 'username email');

    if (!project) {
      const error = new Error('Project not found');
      return res.status(404).json({ msg: error.message });
    }

    if (
      project.creator.toString() !== req.user._id.toString() &&
      !project.partners.some(
        (partner) => partner._id.toString() === req.user._id.toString()
      )
    ) {
      const error = new Error('Not valid action');
      return res.status(404).json({ msg: error.message });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: 'there was an error' });
  }
};

/**
 * [editProject]
 * @description Save the changes of a project for the logged user
 */
const editProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);

    if (!project) {
      const error = new Error('Project not found');
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error('Not valid action');
      return res.status(404).json({ msg: error.message });
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
    project.client = req.body.client || project.client;
    project.name = req.body.name || project.name;

    const savedProject = await project.save(project);
    return res.status(200).json(savedProject);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: 'there was an error' });
  }
};

/**
 * [deleteProject]
 * @description Delete a project for the logged user
 */
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);

    if (!project) {
      const error = new Error('Project not found');
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error('Not valid action');
      return res.status(404).json({ msg: error.message });
    }

    await project.deleteOne();
    return res.status(200).json({ msg: 'Project deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: 'there was an error' });
  }
};

/**
 * [searchPartner]
 * @description search a user that can be added as a partner
 */
const searchPartner = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    '-password -confirmed -token -updatedAt -createdAt -__v'
  );

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  return res.status(200).json(user);
};

/**
 * [addPartner]
 * @description Add a partner to the project
 */
const addPartner = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action');
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    '-password -confirmed -token -updatedAt -createdAt -__v'
  );

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() === user._id.toString()) {
    const error = new Error('Project creator cannot be partner of the project');
    return res.status(400).json({ msg: error.message });
  }

  if (project.partners.includes(user._id)) {
    const error = new Error('User already added as partner');
    return res.status(400).json({ msg: error.message });
  }

  project.partners.push(user._id);
  await project.save();

  return res.status(200).json({ msg: 'Partner added successfully' });
};

/**
 * [deletePartner]
 * @description Delete a partner from a project
 */
const deletePartner = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action');
    return res.status(404).json({ msg: error.message });
  }

  const { id } = req.body;

  project.partners.pull(id);

  await project.save();

  return res.status(200).json({ msg: 'Partner deleted successfully' });
};

export {
  getProjects,
  getProject,
  createProject,
  editProject,
  deleteProject,
  addPartner,
  deletePartner,
  searchPartner,
};
