const express = require('express');
const router = express.Router();

const Models = require('../../Schema/index.js');
const userModel = Models.Users;
const projectModel = Models.Projects;
const taskModel = Models.Tasks;
const requestsModel = Models.Requests;

router.post('/', async (req, res) => {
    // Enpoint to create a new project w/o tasks
    // Request Body : {userid, Proj name, description, skills, tasks, status}

    const userid = req.body.userid;
    const projName = req.body.projName;
    const description = req.body.description;
    const skills = req.body.skills;
    const status = req.body.status;

    if(!Array.isArray(skills)){
        if(tasks && !Array.isArray(tasks)){
            return res.status(400).send({ success: false, message: 'Skills/Tasks must be an array!' });
        }

        return res.status(400).send({ success: false, message: 'Skills must be an array!' });
    }

    const proj = new projectModel({ownerID: userid, projectName: projName, description: description, requiredSkills: skills, status: status});

    try{
        proj.save();
    }catch(err){

        return res.status(400).send({ success: false, message: err.message });
    }

    //Save Project to db, and continue if and only if successful && tasks are present
    if(!tasks)
        return res.status(200).send({ success: true, message: 'Project added successfully!' });

    await taskInsert(tasks, proj.id, res);
});

async function taskInsert(tasks, projid, res){

    for(let i = 0; i < tasks.length; i++){
        const task = tasks[i];
        if(!task.hasOwnProperty('name') && !task.hasOwnProperty('description') && !task.hasOwnProperty('startTime') && !task.hasOwnProperty('endTime') && !task.hasOwnProperty('status')){
            return res.status(400).send({ success: false, message: 'Task must have name, description and endTime!' });
        }
    }

    const tasks = tasks.map(task => {return {projid : projid, ...task}});
    try{
        await taskModel.insertMany(tasks);
    }catch(err){
        return res.status(400).send({ success: false, message: err.message });
    }

    return res.status(200).send({ success: true, message: 'Tasks added successfully!' });
}
// Task Req body: {projid, name, starttime, endtime, description, status(true/false)}