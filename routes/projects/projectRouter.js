const express = require("express");

const Project = require("./projectHelper.js");

const router = express.Router();

router.get("/", (req, res) => {
  Project.getProjects()
    .then(projects => {
      res.status(200).json(
        projects.map(cv => {
          return { ...cv, completed: cv.completed ? "true" : "false" };
        })
      );
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving all projects", err });
    });
});

router.get("/:id", validateId, (req, res) => {
  const id = req.params.id;

  Project.getProjectById(id)
    .then(project => {
      newProj = { ...project[0], completed: project.completed ? "true" : "false" }
      res
        .status(200)
        .json(newProj);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving project", err });
    });
});

router.post("/", validateBody, validateProjectKeys, (req, res) => {
  const body = req.body;

  Project.addProject(body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding project", err });
    });
});

// Middleware

function validateId(req, res, next) {
  const id = req.params.id;

  Project.getProjectById(id)
    .then(project => {
      project[0]
        ? next()
        : res
          .status(404)
          .json({ message: `Project with ID of ${id} does not exist` });
    })
    .catch(err => {
      res.status(500).json({ message: "Error validating ID", err });
    });
}

function validateBody(req, res, next) {
  const body = req.body;

  Object.keys(body).length > 0
    ? next()
    : res.status(400).json({ message: "Request missing body" });
}

function validateProjectKeys(req, res, next) {
  const body = req.body;

  body.name
    ? next()
    : res.status(400).json({ message: "Request body missing 'name' key" });
}

module.exports = router;