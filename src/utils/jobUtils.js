module.exports = {
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

    calculatedBudget(job, valueHour) {
        return valueHour * job["total-hours"];
    },
};
