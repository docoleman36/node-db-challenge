
const db = require("../../data/dbConfig.js");

function getProjects() {
  return db.select("*").from("projects");
}

function getProjectById(id) {
  return db
    .select("*")
    .from("projects")
    .where({ id });
}

function addProject(body) {
  return db
    .insert(body)
    .into("projects")
    .then(res => {
      const id = res[0];
      return db
        .select("*")
        .from("projects")
        .where({ id });
    });
}

module.exports = {
  getProjectById,
  getProjects,
  addProject
};