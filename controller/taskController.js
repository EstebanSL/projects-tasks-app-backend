import Project from '../model/Project.js';
import Task from '../model/Task.js';

/**
 * [createTask]
 * @description Create a new task
 */
const createTask = async (req, res) => {
  const { project } = req.body;

  try {
    const projectExist = await Project.findById(project);

    if (!projectExist) {
      const error = new Error('Project not found');
      return res.status(404).json({ msg: error.message });
    }

    if (projectExist.creator.toString() !== req.user._id.toString()) {
      const error = new Error(
        'You are not allowed to create tasks in this project'
      );
      return res.status(403).json({ msg: error.message });
    }

    const savedTask = await Task.create(req.body);
    projectExist.tasks.push(savedTask._id);
    await projectExist.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: 'There was an error' });
  }
};

/**
 * [getTask]
 * @description Get a task information
 */
const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate('Project');

    if (!task) {
      const error = new Error('Task not found');
      return res.status(404).json({ msg: error.message });
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error('Not valid action');
      return res.status(403).json({ msg: error.message });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(404).json({ msg: 'there was an error' });
  }
};

/**
 * [editTask]
 * @description edit the information of a task
 */
const editTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate('project');

    if (!task) {
      const error = new Error('Task not found');
      return res.status(404).json({ msg: error.message });
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error('Not valid action');
      return res.status(403).json({ msg: error.message });
    }

    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.deliveryDate = req.body.deliveryDate || task.deliveryDate;

    const savedTask = await task.save();
    return res.status(200).json(savedTask);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: 'there was an error' });
  }
};

/**
 * [deleteTask]
 * @description Delete a task
 */
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate('project');

    if (!task) {
      const error = new Error('Task not found');
      return res.status(404).json({ msg: error.message });
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error('Not valid action');
      return res.status(403).json({ msg: error.message });
    }

    const project = await Project.findById(task.project)
    project.tasks.pull(task._id)
    await Promise.allSettled([
      await project.save(), await  await task.deleteOne()
    ])

    return res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (error) {
    return res.status(404).json({ msg: 'there was an error' });
  }
};

const changeStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate('project');

    if (!task) {
      const error = new Error('Task not found');
      return res.status(404).json({ msg: error.message });
    }

    if (
      task.project.creator.toString() !== req.user._id.toString() &&
      !task.project.partners.some(
        (partner) => partner._id.toString() === req.user._id.toString()
      )
    ) {
      const error = new Error('Not valid action');
      return res.status(403).json({ msg: error.message });
    }

    task.status = !task.status
    task.completedBy = req.user._id
    await task.save()

    const savedTask = await Task.findById(id).populate('completedBy').populate('project');
    return res.status(200).json(savedTask);


    
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: 'there was an error' });
  }
};

export { getTask, createTask, editTask, deleteTask, changeStatus };
