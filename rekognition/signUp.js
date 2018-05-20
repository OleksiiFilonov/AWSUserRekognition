'use strict';

const AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition();
var s3 = new AWS.S3();

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

  const bucketParams = {
    Body: buf,
    Bucket: "user-images-bucket-jnj",
    Key: body.userName,
    ContentType: 'image/jpeg',
    ContentEncoding: 'base64',
    Tagging: "user=" + body.userName
  };
 s3.putObject(bucketParams, function(err, data) {
   if (err) {
     // an error occurred
     console.error(err);
     callback(new Error('Cant upload to S3 backet', err));
   } else {
     console.log('Photo successfully stored in the bucket with key ' + bucketParams.Key, data);           // successful response
   }
 });

  const rekognitionParams = {
    CollectionId: 'userPhotos',
    Image: {
      Bytes: buf
      /*S3Object: {
        Bucket: 'user-images-bucket-jnj',
        Name: body.userName
      }*/
    },
    DetectionAttributes: ["ALL"],
    ExternalImageId: body.userName
  };
  rekognition.indexFaces(rekognitionParams, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      callback(new Error('Error during photo indexing occured', err));
    } else {
      console.log(data);           // successful response
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin' : '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HTTPS
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Photo indexed',
          indexingPhotoData: data
        }),
      };
      callback(null, response);
    }
  });

};
