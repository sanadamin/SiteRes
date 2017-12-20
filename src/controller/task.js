import  mongoose from 'mongoose';
import { Router } from 'express';
import Task from '../model/task';
import Sites from '../model/sites';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';



import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();

api.get('/delete/:id',(req,res)=>{
  Task.findByIdAndRemove(req.params.id,(err)=>{
    if(err){
      res.send(err);
    }
    res.status(200).send('deleted');
  });
});


  api.get('/', (req, res) => {
    var sitenamee = '';
  
    Task.find({}, (err, sites) => {
      if (err) {
        res.send(err);
      }
      res.json(sites);
    });
  });


   api.post('/add', (req, res) => {
    let task = new Task();
    var date = new Date();
    var lat = '';
    var long = '';


    Sites.findOne({'sitename':req.body.sitename},(err,sitee)=>{
      if(err){
        res.send(err);
      }

      lat = sitee.coordinates.lat;
      long = sitee.coordinates.long;
      task.tasklat = lat;
      task.tasklong = long;
      task.taskstarttime =  date.getHours() + ':' +date.getMinutes();
      task.sitename = req.body.sitename;
      task.taskname = req.body.taskname;
      task.taskcat = req.body.taskcat;
      task.taskassignedto = req.body.taskassignedto;
      task.save(function(err) {
        if (err) {
          res.send(err);
        }
        // res.json({ message:req.body.taskname + 'Employee has been saved successfully' });
        res.status(201).send('OK');

      });
    });



  });

  return api;
}

