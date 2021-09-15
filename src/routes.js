const express = require("express");
const routes = express.Router();

// redefinindo caminho de views
const views = __dirname + "/views/";

//objeto do profile
const Profile = {
    data: {
        name: "Pedro",
        avatar: "https://github.com/pedrodruviaro.png",
        "monthly-budget": 3000,
        "hours-per-day": 5,
        "days-per-week": 5,
        "vacation-per-year": 4,
        "value-hour": 75,
    },

    controllers: {
        index(req, res){
            return res.render(views + "profile", { profile: Profile.data })
        },

        update(req, res){
            //req.body para pegar os dados
            const data = req.body

            //definir quantas semanas tem num ano: 52
            const weeksPerYear = 52

            //remover as semanas de ferias do ano para pegar quantas semanas tem em um mes
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"] ) / 12

            //hrs por dia    *  horas na semana = horas trabalhadas na semana
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

            //horas trabalhadas no mes
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            //qual sera o valor da minha hora
            const valueHour = data["value-hour"] = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            res.redirect('/profile')
        }
    }
};

// ------ JOB ------
const Job = {
    data: [
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
            "total-hours": 1,
            created_at: Date.now(),
        },
    ],

    constrollers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
                // ajustes no job
                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? "done" : "progress";

                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculatedBudget(job, Profile.data["value-hour"])
                };
            });

            return res.render(views + "index", { jobs: updatedJobs });
        },

        create(req, res) {
            return res.render(views + "job");
        },

        save(req, res) {
            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now(), //atribuindo uma nova data (em ms)
            });

            return res.redirect("/");
        },

        show(req, res){
            
            const jobId = req.params.id

            //retorna job com mesmo id passado
            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if(!job){
                return res.send('Job not found!')
            }

            job.budget = Job.services.calculatedBudget(job, Profile.data["value-hour"])

            return res.render(views + "job-edit", { job })
        },

        update(req, res){
            const jobId = req.params.id

            //retorna job com mesmo id passado
            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if(!job){
                return res.send('Job not found!')
            }

            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"]
            }

            Job.data = Job.data.map(job => {
                if(Number(job.id === Number(jobId))){
                    job = updatedJob
                }

                return job
            })

            res.redirect(`/job/${jobId}`)
        },

        delete(req, res){
            const jobId = req.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            res.redirect('/')
        }
    },

    services: {
        remainingDays(job) {
            // ajustes no job e calculo de tempo restante
            const remainingDays = (
                job["total-hours"] / job["daily-hours"]
            ).toFixed(); //retorna string
            const createdDate = new Date(job.created_at); //dia de criacao do projeto
            const dueDay = createdDate.getDate() + Number(remainingDays); //DIA do vencimento do projeto
            // dia do mes + dias restantes
            const dueDateInMs = createdDate.setDate(dueDay); //data de VENCIMENTO (em ms)

            const timeDiffInMs = dueDateInMs - Date.now();

            //transformar milli em dias
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);

            return dayDiff; //restam x dias
        },

        calculatedBudget(job, valueHour){
            return valueHour * job["total-hours"]
        }
    },
};

// ------GET------
routes.get("/", Job.constrollers.index);
routes.get("/job", Job.constrollers.create);
routes.get("/job/:id", Job.constrollers.show);
routes.get("/profile", Profile.controllers.index);

// -----POST-----
routes.post("/job", Job.constrollers.save);
routes.post("/profile", Profile.controllers.update);
routes.post("/job/:id", Job.constrollers.update);
routes.post("/job/delete/:id", Job.constrollers.delete);

module.exports = routes;
