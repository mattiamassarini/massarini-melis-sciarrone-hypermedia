'use strict';
var db = require('../utils/database');
var respondWithCode= require('../utils/writer').respondWithCode;

/**
 * Finds all the seminars
 *
 * returns List
 **/
exports.getSeminars = function() {
  return db('seminar')
  .orderBy('date','asc')
  .select();
}

/**
 * Find seminar by ID
 * Returns a single seminar
 *
 * seminarId Long ID of seminar to return
 * returns Seminar
 **/
exports.getSeminarById = function(seminarId) {
  if(!seminarId){
    return new Promise(function (resolve,reject) {
      resolve(respondWithCode(400, {message: 'Invalid id'}));
    });
  }

  return db('seminar').where({'seminar.id': seminarId})
  .then(function(seminars){
    if(seminars.length == 1){
      return seminars[0];
    }
    else {
      return respondWithCode(404,{message: 'seminar not found'})
    }
  })
}

/**
 * Finds all the events correlated to one seminar
 *
 * returns List
 **/
exports.getLinkedEventsBySeminar = function(seminarId) {
  if(!seminarId){
    return new Promise(function (resolve,reject) {
      resolve(respondWithCode(400, {message: 'Invalid id'}));
    });
  }
  
  return db('eventSeminar').where({'eventSeminar.seminarId': seminarId})
  .join('artisticEvent', 'artisticEvent.id', '=', 'eventSeminar.eventId')
  .select('artisticEvent.*').then(function(linkedEvents){
    if(linkedEvents.length > 0){
      return linkedEvents;
    }
    else {
      return respondWithCode(404,{message: 'linked events not found'})
    }
  })
}

