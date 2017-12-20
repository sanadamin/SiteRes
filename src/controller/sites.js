import  mongoose from 'mongoose';
import { Router } from 'express';
import Site from '../model/sites';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';

import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();
  api.get('/', (req, res) => {
    Site.find({}, (err, sites) => {
      if (err) {
        res.send(err);
      }
      res.json(sites);
    });
  });
  api.get('/findsitename/:id', (req, res) => {
    

    Site.find({'sitename': new RegExp(req.params.id,'i')}, (err, sites) => {
      if (err) {
        res.send(err);
      }
      res.json(sites);
    });
  });
  api.get('/find', (req, res) => {
    var nameRegex = new RegExp(req.query.input);
    Site.find({'sitename': new RegExp('bayader','i')}, (err, sites) => {
      if (err) {
        res.send(err);
      }
      res.json(sites);
    });
  });
api.get('/delete/:name',(req,res) =>{
    Site.remove({sitename:req.params.name},(err,site)=>{
      if(err){
        res.send(err);
      }
      res.json({message: 'site has been deleted'});
    });
  });
  api.post('/add', (req, res) => {
    let site = new Site();
    site.sitename = req.body.sitename;
    site.coordinates.lat = req.body.lat;
    site.coordinates.long = req.body.long;

    site.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'site has been saved successfully' });
    });
  });

  return api;
}
