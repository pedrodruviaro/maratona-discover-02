const express = require("express");
const routes = express.Router();

// redefinindo caminho de views
const views = __dirname + "/views/";

//objeto do profile
const profile = {
    name: "Pedro",
    avatar: "https://github.com/pedrodruviaro.png",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 75 
};

// jobs
const jobs = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 60,
        created_at: Date.now(),
    },
    {
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now(),
    },
];

// functions
function remainingDays(job) {
    // ajustes no job e calculo de tempo restante
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed(); //retorna string
    const createdDate = new Date(job.created_at); //dia de criacao do projeto
    const dueDay = createdDate.getDate() + Number(remainingDays); //DIA do vencimento do projeto
    // dia do mes + dias restantes
    const dueDateInMs = createdDate.setDate(dueDay); //data de VENCIMENTO (em ms)

    const timeDiffInMs = dueDateInMs - Date.now();

    //transformar milli em dias
    const dayInMs = 1000 * 60 * 60 * 24;
    const dayDiff = Math.floor(timeDiffInMs / dayInMs);

    return dayDiff; //restam x dias
}

// ------GET------
routes.get("/", (req, res) => {
    const updatedJobs = jobs.map((job) => {
        // ajustes no job
        const remaining = remainingDays(job);
        const status = remaining <= 0 ? "done" : "progress";

        return { ...job, remaining, status, budget: profile["value-hour"] * job["total-hours"] };
    });

    return res.render(views + "index", { jobs: updatedJobs });
});

routes.get("/job", (req, res) => res.render(views + "job"));
routes.get("/job/edit", (req, res) => res.render(views + "job-edit"));
routes.get("/profile", (req, res) =>
    res.render(views + "profile", { profile })
);

// -----POST-----
routes.post("/job", (req, res) => {
    const lastId = jobs[jobs.length - 1]?.id || 1;

    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now(), //atribuindo uma nova data (em ms)
    });

    return res.redirect("/");
});

module.exports = routes;
