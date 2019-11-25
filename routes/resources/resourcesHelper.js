const db = require("../../data/dbConfig.js");

function getResources() {
  return db.select("*").from("resources");
}

function getResourceById(id) {
  return db
    .select("*")
    .from("resources")
    .where({ id });
}

function addResource(body) {
  return db
    .insert(body)
    .into("resources")
    .then(res => {
      const id = res[0];
      return db
        .select("*")
        .from("resources")
        .where({ id });
    });
}

module.exports = {
  getResourceById,
  getResources,
  addResource
};
