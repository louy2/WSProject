import mongoose from 'mongoose'

//import { Serieses } from './stubs/Serieses'
import { Konosuba } from './stubs/Series'

import Card from './api/models/card'
import Series from './api/models/series'
import Deck from './api/models/deck'

module.exports = function(app){

  app.get("/api/serieslist", (req, res) =>{
    Series.find().exec()
    .then( docs => {
      console.log('Series list requested');
      res.status(200).json(docs)
    })
    .catch( err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: 'something went wrong'
      })
    })
  });

  app.get("/api/series/:id/cards", (req, res) => {

    Series.find({_id: req.params.id}).limit(1).exec()
    .then( docs => {
      if( docs.length > 0 ){
        Card.find({ set: docs[0].set, release: docs[0].release }).limit(300).exec()
        .then( cards => {
          res.status(200).json(cards)
        })
      }
      else{
        res.status(500).json({
          error: true,
          message: 'Set was not found'
        })
      }
    })
  });

  app.post("/api/deck", (req, res) => {
    Deck.create(req.body, (err, data) => {
      res.status(200).send({ deck: data })
    });
  })

  app.get("/api/deck/:id", (req, res) => {
    Deck.find({_id: req.params.id}).limit(1).populate('cards').exec()
    .then( docs => {
      if( docs.length > 0 ){
        res.status(200).json(docs)
      }
      else{
        res.status(500).json({
          error: true,
          message: 'Deck was not found'
        })
      }
    })
  })
    
}