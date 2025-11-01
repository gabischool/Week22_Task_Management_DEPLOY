import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  getSubtaskById,
  getSubtasksByTaskId,
} from "../services/taskServices.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await getAllTasks(req.user.id);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getTaskById(id, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = await createTask(taskData, req.user.id);

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedTask = await updateTask(id, updateData, req.user.id);

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    if (error.message === "Task not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await deleteTask(id, req.user.id);

    res.status(200).json({
      success: true,
      data: deletedTask,
    });
  } catch (error) {
    if (error.message === "Task not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

router.get("/tasks/:taskId/subtasks", async (req, res) => {
  try {
    const { taskId } = req.params;
    const subtasks = await getSubtasksByTaskId(taskId, req.user.id);

    res.status(200).json({
      success: true,
      count: subtasks.length,
      data: subtasks,
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("access denied")
    ) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

router.get("/subtasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subtask = await getSubtaskById(id, req.user.id);

    res.status(200).json({
      success: true,
      data: subtask,
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("access denied")
    ) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

router.post("/tasks/:taskId/subtasks", async (req, res) => {
  try {
    const { taskId } = req.params;
    const subtaskData = req.body;
    const newSubtask = await createSubtask(taskId, subtaskData, req.user.id);

    res.status(201).json({
      success: true,
      data: newSubtask,
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("access denied")
    ) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
});

router.put("/subtasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedSubtask = await updateSubtask(id, updateData, req.user.id);

    res.status(200).json({
      success: true,
      data: updatedSubtask,
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("access denied")
    ) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
});

router.delete("/subtasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubtask = await deleteSubtask(id, req.user.id);

    res.status(200).json({
      success: true,
      data: deletedSubtask,
    });
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("access denied")
    ) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

export default router;
