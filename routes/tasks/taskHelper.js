const db = require("../../data/dbConfig.js");

function getTasks() {
  return db
    .select(
      "tasks.id",
      "tasks.description",
      "tasks.notes",
      "tasks.completed",
      "projects.name",
      "projects.description"
    )
    .from("tasks")
    .join("projects", "tasks.project_id", "projects.id");
}

function addTask(task) {
  return db
    .insert(task)
    .into("tasks")
    .then(res => {
      const id = res[0];
      return db
        .select("*")
        .from("tasks")
        .where({ id });
    });
}

module.exports = {
  getTasks,
  addTask
};
