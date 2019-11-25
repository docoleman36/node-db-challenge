const express = require("express");

const Reso = require("./resourcesHelper.js");

const router = express.Router();

router.get("/", (req, res) => {
  Reso.getResources()
    .then(resources => {
      res.status(200).json(resources);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving resources", err });
    });
});

router.get("/:id", validateID, (req, res) => {
  const id = req.params.id;

  Reso.getResourceById(id)
    .then(resource => {
      res.status(200).json(resource);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving resource", err });
    });
});

router.post(
  "/",
  validateBody,
  validateResourceKeys,
  validateUniqueName,
  (req, res) => {
    const body = req.body;

    Reso.addResource(body)
      .then(resource => {
        res.status(201).json(resource);
      })
      .catch(err => {
        res.status(500).json({ message: "Error adding new resource", err });
      });
  }
);

// MIDDLEWARE

function validateID(req, res, next) {
  const id = req.params.id;
  Reso.getResourceById(id)
    .then(resource => {
      resource[0]
        ? next()
        : res
          .status(404)
          .json({ message: `Resource with ID of ${id} not found` });
    })
    .catch(err => {
      res.status(500).json({ message: "Error validating resource ID" });
    });
}

function validateBody(req, res, next) {
  const body = req.body;

  Object.keys(body).length > 0
    ? next()
    : res.status(400).json({ message: "Request missing body" });
}

function validateResourceKeys(req, res, next) {
  const body = req.body;

  body.name
    ? next()
    : res.status(400).json({ message: "Request body missing 'name' key" });
}

function validateUniqueName(req, res, next) {
  const body = req.body;
  Reso.getResources()
    .then(resources => {
      resources.map(cv => {
        cv.name == body.name
          ? res.status(400).json({ message: "Resource names must be unique" })
          : "";
      });
    })
    .then(() => {
      next();
    })
    .catch(err => {
      res.status(500).json({ message: "Error validating uniqueness of name" });
    });
}

module.exports = router;
