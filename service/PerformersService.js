'use strict';
var db = require('../utils/database');
var respondWithCode= require('../utils/writer').respondWithCode;

/**
 * Finds all performers
 *
 * returns List
 **/
exports.getPerformers = function() {
  return db('performer').select();
}

/**
 * Find performer by ID
 * Returns a single performer
 *
 * performerId Long ID of performer to return
 * returns Performer
 **/
exports.getPerformerById = function(performerId) {
  if(!performerId)
    return respondWithCode(400, {message: 'invalidId'})

  return db('performer').where({'performer.id': performerId})
  .then(function(performers){
    if(performers.length == 1){
      return performers[0];
    }
    else {
      return respondWithCode(404,{message: 'performer not found'})
    }
  })
}