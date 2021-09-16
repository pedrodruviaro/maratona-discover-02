const express = require("express");
const routes = express.Router();
const DashboardController = require("./controllers/DashboardController");
const JobController = require("./controllers/JobController");
const ProfileController = require("./controllers/ProfileController");

// ------GET------
routes.get("/", DashboardController.index);
routes.get("/job", JobController.create);
routes.get("/job/:id", JobController.show);
routes.get("/profile", ProfileController.index);

// -----POST-----
routes.post("/job", JobController.save);
routes.post("/profile", ProfileController.update);
routes.post("/job/:id", JobController.update);
routes.post("/job/delete/:id", JobController.delete);

module.exports = routes;
