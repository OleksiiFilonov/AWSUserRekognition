'use strict';

const AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition();

module.exports = function (detectedFace, imageBuffer, callback) {
  const rekognitionParams = {
    Image: {
      Bytes: imageBuffer
    },
    Attributes: ['ALL']
  };
  rekognition.detectFaces(rekognitionParams, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      callback(new Error('Error during face analysis ', err));
    } else {
      // successful response
      let body = {
        message: 'Face Analysis/Detection information',
        confidence: 0,
        faceInfo: data
      }
      if (detectedFace != null) {
        body.detectedFace = detectedFace.ExternalImageId;
        body.confidence = detectedFace.Confidence;
      }

      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin' : '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HTTPS
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      };
      callback(null, response);
    }
  });
};
