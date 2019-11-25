const express = require("express");

const Task = require("./taskHelper.js");

const router = express.Router();

router.get("/", (req, res) => {
  Task.getTasks()
    .then(tasks => {
      res.status(200).json(
        tasks.map(cv => {
          return { ...cv, completed: cv.completed ? "true" : "false" };
        })
      );
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving tasks" });
    });
});

router.post("/", validateBody, validateTaskKeys, (req, res) => {
  const body = req.body;

  Task.addTask(body)
    .then(task => {
      res.status(201).json(task);
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding task", err });
    });
});

// MIDDLEWARE

function validateBody(req, res, next) {
  const body = req.body;

  Object.keys(body).length > 0
    ? next()
    : res.status(400).json({ message: "Request missing body" });
}

function validateTaskKeys(req, res, next) {
  const body = req.body;

  body.description && body.project_id
    ? next()
    : res.status(400).json({
      message: "Request body missing 'description' or 'project_id' key"
    });
}

module.exports = router;
