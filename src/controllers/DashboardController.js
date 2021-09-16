const JobUtils = require('../utils/jobUtils')
const Job = require('../model/Job')
const Profile = require('../model/Profile')

module.exports = {
    index(req, res) {
        const jobs = Job.get();
        const updatedJobs = jobs.map((job) => {
            // ajustes no job
            const remaining = JobUtils.remainingDays(job);
            const status = remaining <= 0 ? "done" : "progress";

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculatedBudget(
                    job,
                    Profile.get()["value-hour"]
                ),
            };
        });

        return res.render("index", { jobs: updatedJobs });
    },
};
