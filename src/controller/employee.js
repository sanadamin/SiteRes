import  mongoose from 'mongoose';
import { Router } from 'express';
import Emp from '../model/Employee';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';
var FCM = require('fcm-node');
 var serverKey = require('./umniah-9c3a1-firebase-adminsdk-x0wjp-b99ddc3da6.json') //put your server key here
 var fcm = new FCM(serverKey);

import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();
  api.get('/', (req, res) => {
    Emp.find({}, (err, sites) => {
      if (err) {
        res.send(err);
      }
      res.json(sites);
    });
  });

  api.post('/authemp/:id', (req, res) => {
    Emp.findOne({'empusername':req.params.id}, (err, emp) => {
      if (err) {
        res.send(err);
      }
      if(emp.emppassword === req.body.password){
        res.status(200).send('pass');
      }else if (emp.emppassword != req.body.password) {
        res.status(201).send('reject');
      }
    });
  });


api.get('/send', (req, res) => {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'e7euzIAgOmY:APA91bG1TYmz4KjJ7oDGv-OoemRsEcwE8ZS_EYKWe01Flb-byR51Rh-oh-fh2SZthCRIW3vMuuBsse0MXy6FTCCXDozAWK6ZPlO1w4nhGeWaxe97SBteUOc4Lt1dcbPsUSo7KEWbSsQe',
        notification: {
             title: 'New Task',
             body: 'Body of your push notification',
        	sound:"alert.wav"        }

    };

    fcm.send(message, function(err, response){
        if (err) {
            res.send(err);
        }
    });
  });

  api.get('/findempname/:id', (req, res) => {


    Emp.find({'empusername': new RegExp(req.params.id,'i')}, (err, sites) => {
      if (err) {
        res.send(err);
      }
      res.json(sites);
    });
 });
api.put('/token/:name', (req, res) => {
    Emp.findById(req.params.name, (err, employee) => {
      if (err) {
        res.send(err);
      }
      employee.empregtoken = req.body.empregtoken;
      employee.save(function(err){
        if(err){
          res.send(err);
        }
          res.json(employee.empregtoken);
      })

      });

  });


  api.put('/updateemp/:name', (req, res) => {
    Emp.findById(req.params.name, (err, employee) => {
      if (err) {
        res.send(err);
      }

      employee.emplat = req.body.emplat;
      employee.emplong = req.body.emplong;
      employee.save(function(err){
        if(err){
          res.send(err);
        }
          res.json(employee.emplat);
      })

      });

  });

  api.post('/add', (req, res) => {
    let emp = new Emp();


    emp.empname = req.body.empname;
    emp.empusername = req.body.empusername;
    emp.emppassword = req.body.emppassword;
    
    emp.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message:req.body.emplat + 'Employee has been saved successfully' });
    });
  });

  return api;
}

