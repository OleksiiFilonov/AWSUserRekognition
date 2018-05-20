'use strict';

const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();
const detectFace = require('./detectFace.js');

module.exports.handler = (event, context, callback) => {

/*  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Photo indexed',
      input: event
    }),
  };
  callback(null, response);*/

  const body = JSON.parse(event.body);
  //const body = event.body;
  //image - Base-64 encoded
  //user name -> ExternalImageId

  const buf = Buffer.from(body.image.replace(/^data:image\/\w+;base64,/, ""),"base64");

  const rekognitionParams = {
    CollectionId: 'userPhotos',
    Image: {
      Bytes: buf
    },
    FaceMatchThreshold: 80.0,
    MaxFaces: 1
  };
  rekognition.searchFacesByImage(rekognitionParams, function(err, data) {
    if (err) {
      console.log(err); // an error occurred
      const response = {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin' : '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HTTPS
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confidence: 0,
          errorType: "Bad Request",
          error: err
        }),
      };
      callback(null, response);
    } else {
      // successful response
      //console.log('found external face: ' + JSON.stringify(data.FaceMatches[0]));
      detectFace(data.FaceMatches[0].Face, buf, callback);
    }
  });

};
