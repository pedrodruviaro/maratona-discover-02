let data = [
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
    }
];

// funcoes do job model (responsavel pela alteracao dos dados)
module.exports = {
    get(){
        return data
    },

    update(newJob){
        data = newJob
    },

    delete(jobId){
        data = data.filter((job) => Number(job.id) !== Number(jobId));
    }
};
