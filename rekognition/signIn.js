'use strict';

const AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition();

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
      /*S3Object: {
        Bucket: 'user-images-bucket-jnj',
        Name: body.userName
      }*/
    },
    FaceMatchThreshold: 80.0,
    MaxFaces: 1
  };
  rekognition.searchFacesByImage(rekognitionParams, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      callback(new Error('Error during photo searching ', err));
    } else {
      console.log(data);           // successful response
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin' : '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials' : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
          message: 'Detection information',
          detectionData: data
        }),
      };
      callback(null, response);
    }
  });

};
